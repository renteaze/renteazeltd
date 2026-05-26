import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import PortalShell from "@/components/portal/PortalShell";
import AddressAutocomplete from "@/components/auth/AddressAutocomplete";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const propertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  property_type: z.enum(["apartment", "house", "duplex", "bungalow", "commercial", "land", "other"]),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().default("NG"),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  toilets: z.number().optional(),
  square_footage: z.number().optional(),
  year_built: z.number().optional(),
  furnishing_status: z.enum(["furnished", "semi_furnished", "unfurnished"]).optional(),
  amenities: z.array(z.string()).default([]),
  monthly_rent: z.number().optional(),
  annual_rent: z.number().optional(),
  security_deposit: z.number().optional(),
  service_charge: z.number().optional(),
  is_available: z.boolean().default(true),
  is_public_listing: z.boolean().default(false),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "duplex", label: "Duplex" },
  { value: "bungalow", label: "Bungalow" },
  { value: "commercial", label: "Commercial Property" },
  { value: "land", label: "Land" },
  { value: "other", label: "Other" },
];

const FURNISHING_OPTIONS = [
  { value: "furnished", label: "Furnished" },
  { value: "semi_furnished", label: "Semi-furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];

const AMENITIES = [
  "Air Conditioning",
  "Generator",
  "Security",
  "Parking",
  "Gym",
  "Swimming Pool",
  "Elevator",
  "Balcony",
  "Garden",
  "Internet",
  "Water Heater",
  "Wardrobe",
  "Kitchen Appliances",
];

const LandlordAddProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [addressCoords, setAddressCoords] = useState<{ lat: number; lon: number } | null>(null);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      country: "NG",
      is_available: true,
      is_public_listing: false,
      amenities: [],
    },
  });

  const propertyType = form.watch("property_type");
  const isResidential = ["apartment", "house", "duplex", "bungalow"].includes(propertyType || "");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, image);

      if (error) {
        console.error('Error uploading image:', error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const onSubmit = async (data: PropertyFormData) => {
    if (!user) return;

    setSubmitting(true);
    try {
      // Upload images first
      const uploadedImageUrls = await uploadImages();

      const propertyData = {
        ...data,
        landlord_id: user.id,
        images: uploadedImageUrls,
        latitude: addressCoords?.lat,
        longitude: addressCoords?.lon,
      };

      const { data: property, error } = await (supabase as any)
        .from("properties")
        .insert(propertyData)
        .select()
        .single();

      if (error) throw error;

      toast.success("Property added successfully!");
      navigate(`/landlord/properties/${property.id}`);
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("Failed to add property. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortalShell role="landlord">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
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

        <div>
          <h1 className="text-3xl font-bold">Add New Property</h1>
          <p className="text-muted-foreground">
            Fill in the details below to add a new property to your portfolio.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Essential details about your property
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 3 Bedroom Apartment in Lekki" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your property..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="property_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROPERTY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>
                  Where is your property located?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <AddressAutocomplete
                          value={field.value || ""}
                          onChange={(v, coords) => {
                            field.onChange(v);
                            if (coords) setAddressCoords(coords);
                          }}
                          placeholder="Enter full address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            {isResidential && (
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                  <CardDescription>
                    Additional details about the property
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="toilets"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Toilets</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="square_footage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Square Footage</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="year_built"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year Built</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="furnishing_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Furnishing Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select furnishing status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {FURNISHING_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amenities"
                    render={() => (
                      <FormItem>
                        <FormLabel>Amenities</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {AMENITIES.map((amenity) => (
                            <FormField
                              key={amenity}
                              control={form.control}
                              name="amenities"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(amenity)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, amenity])
                                          : field.onChange(field.value?.filter((value) => value !== amenity));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {amenity}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
                <CardDescription>
                  Rent and other financial details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="monthly_rent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Rent (₦)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="annual_rent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Rent (₦)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="security_deposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Deposit (₦)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="service_charge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Charge (₦)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
                <CardDescription>
                  Upload photos of your property (max 10 images)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Images
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {images.length} images selected
                    </span>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Availability & Visibility */}
            <Card>
              <CardHeader>
                <CardTitle>Availability & Visibility</CardTitle>
                <CardDescription>
                  Control when and how your property appears
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="is_available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Available for rent</FormLabel>
                        <FormDescription>
                          Mark as available if this property is ready for new tenants
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_public_listing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Public listing</FormLabel>
                        <FormDescription>
                          Make this property visible to all users browsing properties
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/landlord/properties")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Adding Property..." : "Add Property"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </PortalShell>
  );
};

export default LandlordAddProperty;