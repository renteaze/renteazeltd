import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Building2, MapPin, Calendar, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PortalShell from "@/components/portal/PortalShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatNGN } from "@/lib/format";

interface Property {
  id: string;
  title: string;
  property_type: string;
  address: string;
  city: string;
  state: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  is_available: boolean;
  images: string[];
  created_at: string;
  _count?: {
    tenancy_records: number;
  };
}

const LandlordProperties = () => {
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("properties")
        .select(`
          *,
          tenancy_records(count)
        `)
        .eq("landlord_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties((data as Property[]) || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
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

  if (loading) {
    return (
      <PortalShell role="landlord">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading properties...</p>
          </div>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell role="landlord">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Properties</h1>
            <p className="text-muted-foreground">
              Manage your rental properties and track occupancy
            </p>
          </div>
          <Button onClick={() => navigate("/landlord/properties/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {properties.filter(p => p.is_available).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupied</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {properties.filter(p => !p.is_available).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNGN(
                  properties
                    .filter(p => !p.is_available)
                    .reduce((sum, p) => sum + (p.monthly_rent || 0), 0)
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties List */}
        {properties.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start by adding your first rental property to begin managing your portfolio.
              </p>
              <Button onClick={() => navigate("/landlord/properties/add")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/landlord/properties/${property.id}`)}
              >
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{property.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {property.address}, {property.city}
                      </CardDescription>
                    </div>
                    <Badge variant={property.is_available ? "default" : "secondary"}>
                      {property.is_available ? "Available" : "Occupied"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{getPropertyTypeLabel(property.property_type)}</span>
                    </div>

                    {property.bedrooms && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Bedrooms:</span>
                        <span>{property.bedrooms}</span>
                      </div>
                    )}

                    {property.monthly_rent && (
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span className="text-muted-foreground">Monthly Rent:</span>
                        <span>{formatNGN(property.monthly_rent)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tenants:</span>
                      <span>{property._count?.tenancy_records || 0}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Added:</span>
                      <span>{new Date(property.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  );
};

export default LandlordProperties;
