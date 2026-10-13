-- ==========================================================
-- EAGLE EYE VIEW STORE & ADMIN — PRODUCTION SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor (https://supabase.com)
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL CHECK (department IN ('electronics', 'fashion')),
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    subcategories JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL CHECK (department IN ('electronics', 'fashion')),
    category TEXT NOT NULL,
    subcategory TEXT,
    brand TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    old_price NUMERIC,
    rating NUMERIC DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    images JSONB DEFAULT '[]'::jsonb,
    badges JSONB DEFAULT '[]'::jsonb,
    stock INTEGER DEFAULT 0 NOT NULL,
    is_best_seller BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    -- Electronics
    specs JSONB DEFAULT '[]'::jsonb,
    key_spec TEXT,
    -- Fashion
    colors JSONB DEFAULT '[]'::jsonb,
    material TEXT,
    bag_type TEXT,
    closure TEXT,
    dimensions TEXT,
    care_instructions TEXT,
    whats_included JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    shipping_fee NUMERIC DEFAULT 0 NOT NULL,
    total NUMERIC NOT NULL,
    shipping_address JSONB NOT NULL,
    delivery_method TEXT DEFAULT 'standard' NOT NULL,
    payment_method TEXT DEFAULT 'card' NOT NULL,
    payment_status TEXT DEFAULT 'pending' NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Payment Gateways Table
CREATE TABLE IF NOT EXISTS public.payment_gateways (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT false,
    mode TEXT DEFAULT 'sandbox' CHECK (mode IN ('sandbox', 'live')),
    merchant_id TEXT,
    public_key TEXT,
    secret_key TEXT,
    client_id TEXT,
    currency TEXT DEFAULT 'LKR',
    instructions TEXT,
    usd_rate NUMERIC DEFAULT 310,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Row Level Security (RLS) Configuration
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they already exist
DROP POLICY IF EXISTS "Public Categories Read" ON public.categories;
DROP POLICY IF EXISTS "Public Products Read" ON public.products;
DROP POLICY IF EXISTS "Public Payment Gateways Read" ON public.payment_gateways;
DROP POLICY IF EXISTS "Categories Management" ON public.categories;
DROP POLICY IF EXISTS "Products Management" ON public.products;
DROP POLICY IF EXISTS "Orders Management" ON public.orders;
DROP POLICY IF EXISTS "Payment Gateways Management" ON public.payment_gateways;

-- Allow public read access for customer storefront
CREATE POLICY "Public Categories Read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Products Read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Payment Gateways Read" ON public.payment_gateways FOR SELECT USING (true);

-- Allow management access
CREATE POLICY "Categories Management" ON public.categories FOR ALL USING (true);
CREATE POLICY "Products Management" ON public.products FOR ALL USING (true);
CREATE POLICY "Orders Management" ON public.orders FOR ALL USING (true);
CREATE POLICY "Payment Gateways Management" ON public.payment_gateways FOR ALL USING (true);

-- Insert Default Gateway Configs
INSERT INTO public.payment_gateways (id, name, description, enabled, mode, merchant_id, secret_key, currency)
VALUES
('payhere', 'PayHere (Sri Lanka)', 'Accept Visa, MasterCard, AMEX, FriMi, Genie, eZ Cash & mCash', true, 'sandbox', '1211149', '4MjQ0NTEyMDUx', 'LKR'),
('webxpay', 'WEBXPAY', 'Accept LankaQR, Visa, MasterCard, Sampath Vishwa & Mobile wallets', true, 'sandbox', 'WX-SANDBOX-DEMO-001', 'WX-SECRET-DEMO-001', 'LKR'),
('paypal', 'PayPal Global', 'Accept international payments with PayPal balances and cards in USD', false, 'sandbox', NULL, NULL, 'USD'),
('cod', 'Cash on Delivery (COD)', 'Accept cash upon receiving delivery', true, 'live', NULL, NULL, 'LKR')
ON CONFLICT (id) DO NOTHING;

-- 7. Indexes for High Performance Querying
CREATE INDEX IF NOT EXISTS idx_products_department ON public.products(department);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
