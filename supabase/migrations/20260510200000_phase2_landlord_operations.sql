-- Phase 2: Landlord Operations - Properties, Tenants, Payments, Maintenance
-- Migration: 20260510200000_phase2_landlord_operations.sql

-- Create properties table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'duplex', 'bungalow', 'commercial', 'land', 'other')),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'NG',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  bedrooms INTEGER,
  bathrooms INTEGER,
  toilets INTEGER,
  square_footage INTEGER,
  year_built INTEGER,
  furnishing_status TEXT CHECK (furnishing_status IN ('furnished', 'semi_furnished', 'unfurnished')),
  amenities TEXT[], -- Array of amenities
  monthly_rent DECIMAL(12, 2),
  annual_rent DECIMAL(12, 2),
  security_deposit DECIMAL(12, 2),
  service_charge DECIMAL(12, 2),
  is_available BOOLEAN DEFAULT true,
  is_public_listing BOOLEAN DEFAULT false,
  images TEXT[], -- Array of image URLs from storage
  documents TEXT[], -- Array of document URLs from storage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tenancy_records table
CREATE TABLE tenancy_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_name TEXT NOT NULL,
  tenant_email TEXT NOT NULL,
  tenant_phone TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_rent DECIMAL(12, 2) NOT NULL,
  security_deposit DECIMAL(12, 2),
  service_charge DECIMAL(12, 2),
  payment_frequency TEXT DEFAULT 'monthly' CHECK (payment_frequency IN ('monthly', 'quarterly', 'annually')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated', 'expired')),
  lease_document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, tenant_id, start_date) -- Prevent duplicate active tenancies
);

-- Create maintenance_requests table
CREATE TABLE maintenance_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenancy_id UUID REFERENCES tenancy_records(id) ON DELETE SET NULL,
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('plumbing', 'electrical', 'structural', 'painting', 'cleaning', 'security', 'other')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  estimated_cost DECIMAL(12, 2),
  actual_cost DECIMAL(12, 2),
  assigned_to TEXT, -- Contractor or maintenance person
  scheduled_date DATE,
  completed_date DATE,
  images TEXT[], -- Array of image URLs
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table (extends from Phase 1)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenancy_id UUID REFERENCES tenancy_records(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('rent_payment', 'security_deposit', 'service_charge', 'maintenance_fee', 'refund', 'penalty', 'other')),
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  description TEXT,
  payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'cash', 'pos', 'online', 'cheque', 'other')),
  reference_number TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'overdue')),
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Landlords can read/write their own properties
CREATE POLICY "Landlords can view their own properties" ON properties
  FOR SELECT USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can insert their own properties" ON properties
  FOR INSERT WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update their own properties" ON properties
  FOR UPDATE USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete their own properties" ON properties
  FOR DELETE USING (auth.uid() = landlord_id);

-- Public can read properties marked as public listings
CREATE POLICY "Public can view public property listings" ON properties
  FOR SELECT USING (is_public_listing = true);

-- Admins can read all properties
CREATE POLICY "Admins can view all properties" ON properties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'staff')
    )
  );

-- Add RLS policies for tenancy_records table
ALTER TABLE tenancy_records ENABLE ROW LEVEL SECURITY;

-- Landlords can read/write tenancy records for their properties
CREATE POLICY "Landlords can view tenancy records for their properties" ON tenancy_records
  FOR SELECT USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can insert tenancy records for their properties" ON tenancy_records
  FOR INSERT WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update tenancy records for their properties" ON tenancy_records
  FOR UPDATE USING (auth.uid() = landlord_id);

-- Tenants can read their own tenancy records
CREATE POLICY "Tenants can view their own tenancy records" ON tenancy_records
  FOR SELECT USING (auth.uid() = tenant_id);

-- Admins can read all tenancy records
CREATE POLICY "Admins can view all tenancy records" ON tenancy_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'staff')
    )
  );

-- Add RLS policies for maintenance_requests table
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Landlords can read/write maintenance requests for their properties
CREATE POLICY "Landlords can view maintenance requests for their properties" ON maintenance_requests
  FOR SELECT USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can insert maintenance requests for their properties" ON maintenance_requests
  FOR INSERT WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update maintenance requests for their properties" ON maintenance_requests
  FOR UPDATE USING (auth.uid() = landlord_id);

-- Tenants can read/write maintenance requests for their tenancies
CREATE POLICY "Tenants can view maintenance requests for their tenancies" ON maintenance_requests
  FOR SELECT USING (auth.uid() = tenant_id);

CREATE POLICY "Tenants can insert maintenance requests for their tenancies" ON maintenance_requests
  FOR INSERT WITH CHECK (auth.uid() = tenant_id);

-- Admins can read all maintenance requests
CREATE POLICY "Admins can view all maintenance requests" ON maintenance_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'staff')
    )
  );

-- Add RLS policies for transactions table
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Landlords can view transactions related to their properties' tenancies
CREATE POLICY "Landlords can view transactions for their properties" ON transactions
  FOR SELECT USING (
    tenancy_id IN (
      SELECT id FROM tenancy_records WHERE landlord_id = auth.uid()
    )
  );

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions" ON transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'staff')
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_properties_landlord_id ON properties(landlord_id);
CREATE INDEX idx_properties_is_public_listing ON properties(is_public_listing);
CREATE INDEX idx_properties_city_state ON properties(city, state);
CREATE INDEX idx_tenancy_records_property_id ON tenancy_records(property_id);
CREATE INDEX idx_tenancy_records_landlord_id ON tenancy_records(landlord_id);
CREATE INDEX idx_tenancy_records_tenant_id ON tenancy_records(tenant_id);
CREATE INDEX idx_tenancy_records_status ON tenancy_records(status);
CREATE INDEX idx_maintenance_requests_property_id ON maintenance_requests(property_id);
CREATE INDEX idx_maintenance_requests_landlord_id ON maintenance_requests(landlord_id);
CREATE INDEX idx_maintenance_requests_tenant_id ON maintenance_requests(tenant_id);
CREATE INDEX idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_tenancy_id ON transactions(tenancy_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenancy_records_updated_at BEFORE UPDATE ON tenancy_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON maintenance_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();