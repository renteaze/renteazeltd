import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, Calendar, DollarSign, Users, Wrench, FileText, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PortalShell from "@/components/portal/PortalShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatNGN } from "@/lib/format";

interface Property {
  id: string;
  title: string;
  description: string;
  property_type: string;
  address: string;
  city: string;
  state: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  square_footage: number;
  year_built: number;
  furnishing_status: string;
  amenities: string[];
  monthly_rent: number;
  annual_rent: number;
  security_deposit: number;
  service_charge: number;
  is_available: boolean;
  is_public_listing: boolean;
  images: string[];
  created_at: string;
  updated_at: string;
}

interface TenancyRecord {
  id: string;
  tenant_name: string;
  tenant_email: string;
  tenant_phone: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  status: string;
  profiles: {
    avatar_url: string;
  };
}

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  estimated_cost: number;
  actual_cost: number;
  scheduled_date: string;
  completed_date: string;
  created_at: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  transaction_date: string;
  status: string;
}

const LandlordPropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [tenants, setTenants] = useState<TenancyRecord[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchPropertyData();
    }
  }, [id, user]);

  const fetchPropertyData = async () => {
    try {
      // Fetch property details
      const sb = supabase as any;
      const { data: propertyData, error: propertyError } = await sb
        .from("properties")
        .select("*")
        .eq("id", id)
        .eq("landlord_id", user?.id)
        .single();

      if (propertyError) throw propertyError;
      setProperty(propertyData as Property);

      // Fetch tenancy records
      const { data: tenancyData, error: tenancyError } = await sb
        .from("tenancy_records")
        .select(`
          *,
          profiles!inner(avatar_url)
        `)
        .eq("property_id", id)
        .eq("landlord_id", user?.id)
        .order("start_date", { ascending: false });

      if (tenancyError) {
        console.error("Error fetching tenancy records:", tenancyError);
      } else {
        setTenants((tenancyData as TenancyRecord[]) || []);
      }

      // Fetch maintenance requests
      const { data: maintenanceData, error: maintenanceError } = await sb
        .from("maintenance_requests")
        .select("*")
        .eq("property_id", id)
        .eq("landlord_id", user?.id)
        .order("created_at", { ascending: false });

      if (maintenanceError) {
        console.error("Error fetching maintenance requests:", maintenanceError);
      } else {
        setMaintenance((maintenanceData as MaintenanceRequest[]) || []);
      }

      // Fetch transactions
      const { data: transactionData, error: transactionError } = await sb
        .from("transactions")
        .select("*")
        .eq("tenancy_id", tenancyData?.[0]?.id || "")
        .order("transaction_date", { ascending: false });

      if (transactionError) {
        console.error("Error fetching transactions:", transactionError);
      } else {
        setTransactions((transactionData as Transaction[]) || []);
      }
    } catch (error) {
      console.error("Error fetching property data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      apartment: "Apartment",
      house: "House",
      duplex: "Duplex",
      bungalow: "Bungalow",
      commercial: "Commercial",
      land: "Land",
      other: "Other",
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Active" },
      inactive: { variant: "secondary" as const, label: "Inactive" },
      terminated: { variant: "destructive" as const, label: "Terminated" },
      expired: { variant: "outline" as const, label: "Expired" },
      pending: { variant: "secondary" as const, label: "Pending" },
      in_progress: { variant: "default" as const, label: "In Progress" },
      completed: { variant: "default" as const, label: "Completed" },
      cancelled: { variant: "outline" as const, label: "Cancelled" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { variant: "secondary" as const, label: "Low" },
      medium: { variant: "default" as const, label: "Medium" },
      high: { variant: "destructive" as const, label: "High" },
      urgent: { variant: "destructive" as const, label: "Urgent" },
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <PortalShell role="landlord">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading property details...</p>
          </div>
        </div>
      </PortalShell>
    );
  }

  if (!property) {
    return (
      <PortalShell role="landlord">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The property you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate("/landlord/properties")}>
            Back to Properties
          </Button>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell role="landlord">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/landlord/properties")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </div>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Property
          </Button>
        </div>

        {/* Property Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Property Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {property.address}, {property.city}, {property.state}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={property.is_available ? "default" : "secondary"}>
                {property.is_available ? "Available" : "Occupied"}
              </Badge>
              <Badge variant="outline">{getPropertyTypeLabel(property.property_type)}</Badge>
            </div>

            {property.monthly_rent && (
              <div className="text-2xl font-bold text-primary">
                {formatNGN(property.monthly_rent)}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              {property.bedrooms && (
                <div>
                  <div className="font-medium">{property.bedrooms}</div>
                  <div className="text-muted-foreground">Bedrooms</div>
                </div>
              )}
              {property.bathrooms && (
                <div>
                  <div className="font-medium">{property.bathrooms}</div>
                  <div className="text-muted-foreground">Bathrooms</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tenants">Tenants ({tenants.length})</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance ({maintenance.length})</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{getPropertyTypeLabel(property.property_type)}</span>
                  </div>
                  {property.bedrooms && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bedrooms:</span>
                      <span>{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bathrooms:</span>
                      <span>{property.bathrooms}</span>
                    </div>
                  )}
                  {property.square_footage && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Square Footage:</span>
                      <span>{property.square_footage.toLocaleString()} sq ft</span>
                    </div>
                  )}
                  {property.year_built && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year Built:</span>
                      <span>{property.year_built}</span>
                    </div>
                  )}
                  {property.furnishing_status && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Furnishing:</span>
                      <span className="capitalize">{property.furnishing_status.replace('_', ' ')}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Financial Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {property.monthly_rent && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Rent:</span>
                      <span className="font-medium">{formatNGN(property.monthly_rent)}</span>
                    </div>
                  )}
                  {property.annual_rent && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annual Rent:</span>
                      <span>{formatNGN(property.annual_rent)}</span>
                    </div>
                  )}
                  {property.security_deposit && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security Deposit:</span>
                      <span>{formatNGN(property.security_deposit)}</span>
                    </div>
                  )}
                  {property.service_charge && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Charge:</span>
                      <span>{formatNGN(property.service_charge)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {property.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{property.description}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tenants Tab */}
          <TabsContent value="tenants" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Tenancy History</h2>
              <Button onClick={() => navigate(`/landlord/properties/${id}/add-tenant`)}>
                <Users className="h-4 w-4 mr-2" />
                Add Tenant
              </Button>
            </div>

            {tenants.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tenants yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    This property doesn't have any tenancy records.
                  </p>
                  <Button onClick={() => navigate(`/landlord/properties/${id}/add-tenant`)}>
                    Add First Tenant
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {tenants.map((tenant) => (
                  <Card key={tenant.id}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={tenant.profiles?.avatar_url} />
                          <AvatarFallback>
                            {tenant.tenant_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{tenant.tenant_name}</h3>
                          <p className="text-sm text-muted-foreground">{tenant.tenant_email}</p>
                          <p className="text-sm text-muted-foreground">{tenant.tenant_phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatNGN(tenant.monthly_rent)}/month</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(tenant.start_date).toLocaleDateString()} - {tenant.end_date ? new Date(tenant.end_date).toLocaleDateString() : 'Present'}
                        </div>
                        {getStatusBadge(tenant.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Maintenance Requests</h2>
              <Button onClick={() => navigate(`/landlord/properties/${id}/maintenance/new`)}>
                <Wrench className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>

            {maintenance.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No maintenance requests</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    This property doesn't have any maintenance requests.
                  </p>
                  <Button onClick={() => navigate(`/landlord/properties/${id}/maintenance/new`)}>
                    Create First Request
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {maintenance.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{request.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
                        </div>
                        <div className="flex gap-2">
                          {getPriorityBadge(request.priority)}
                          {getStatusBadge(request.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Category</div>
                          <div className="capitalize">{request.category}</div>
                        </div>
                        {request.estimated_cost && (
                          <div>
                            <div className="text-muted-foreground">Est. Cost</div>
                            <div>{formatNGN(request.estimated_cost)}</div>
                          </div>
                        )}
                        {request.scheduled_date && (
                          <div>
                            <div className="text-muted-foreground">Scheduled</div>
                            <div>{new Date(request.scheduled_date).toLocaleDateString()}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-muted-foreground">Created</div>
                          <div>{new Date(request.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Financial Records</h2>
              <Button onClick={() => navigate(`/landlord/properties/${id}/payments/log`)}>
                <DollarSign className="h-4 w-4 mr-2" />
                Log Payment
              </Button>
            </div>

            {transactions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    This property doesn't have any financial transactions recorded.
                  </p>
                  <Button onClick={() => navigate(`/landlord/properties/${id}/payments/log`)}>
                    Log First Payment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div>
                        <h3 className="font-semibold">{transaction.description}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${transaction.type === 'rent_payment' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'rent_payment' ? '+' : '-'}{formatNGN(transaction.amount)}
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PortalShell>
  );
};

export default LandlordPropertyDetail;