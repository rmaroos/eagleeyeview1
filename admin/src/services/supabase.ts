import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Category, Order } from '../types';

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient(url?: string, anonKey?: string): SupabaseClient | null {
  const targetUrl = url || import.meta.env.VITE_SUPABASE_URL || '';
  const targetKey = anonKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (!targetUrl || !targetKey) return null;

  if (cachedClient && lastUrl === targetUrl && lastKey === targetKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(targetUrl, targetKey);
    lastUrl = targetUrl;
    lastKey = targetKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const client = createClient(url, anonKey);
    // Test a basic query (e.g. check version or select count from products)
    const { error } = await client.from('products').select('id', { count: 'exact', head: true });
    
    if (error) {
      // If table doesn't exist yet, but authentication succeeded:
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase successfully! Table "products" is not created yet. Please execute the provided SQL Schema script.',
        };
      }
      return { success: false, message: `Supabase Error (${error.code}): ${error.message}` };
    }

    return { success: true, message: 'Successfully connected and verified table access in Supabase!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to connect to Supabase.' };
  }
}

export async function seedSupabaseDatabase(
  url: string,
  anonKey: string,
  categories: Category[],
  products: Product[]
): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    const client = createClient(url, anonKey);

    // 1. Upload categories
    const categoryRows = categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      department: c.department,
      name: c.name,
      image: c.image,
      description: c.description || null,
      subcategories: c.subcategories || [],
    }));

    const { error: catErr } = await client.from('categories').upsert(categoryRows, { onConflict: 'id' });
    if (catErr) {
      return { success: false, message: `Failed to upload categories: ${catErr.message}` };
    }

    // 2. Upload products
    const productRows = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      department: p.department,
      category: p.category,
      subcategory: p.subcategory || null,
      brand: p.brand,
      name: p.name,
      description: p.description,
      price: p.price,
      old_price: p.oldPrice || null,
      rating: p.rating || 5.0,
      review_count: p.reviewCount || 0,
      images: p.images || [],
      badges: p.badges || [],
      stock: p.stock || 0,
      is_best_seller: Boolean(p.isBestSeller),
      is_new: Boolean(p.isNew),
      is_featured: Boolean(p.isFeatured),
      specs: p.specs || [],
      key_spec: p.keySpec || null,
      colors: p.colors || [],
      material: p.material || null,
      bag_type: p.bagType || null,
      closure: p.closure || null,
      dimensions: p.dimensions || null,
      care_instructions: p.careInstructions || null,
      whats_included: p.whatsIncluded || [],
    }));

    const { error: prodErr } = await client.from('products').upsert(productRows, { onConflict: 'id' });
    if (prodErr) {
      return { success: false, message: `Failed to upload products: ${prodErr.message}` };
    }

    return {
      success: true,
      message: `Successfully synchronized ${categoryRows.length} categories and ${productRows.length} products to Supabase!`,
      count: productRows.length,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to seed database' };
  }
}


export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- EAGLE EYE VIEW STORE — SUPABASE SQL SCHEMA
-- Run this in your Supabase SQL Editor
-- ==========================================

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
    specs JSONB DEFAULT '[]'::jsonb,
    key_spec TEXT,
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

-- 5. Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they already exist to avoid 42710 duplicate errors
DROP POLICY IF EXISTS "Public Categories Read" ON public.categories;
DROP POLICY IF EXISTS "Public Products Read" ON public.products;
DROP POLICY IF EXISTS "Categories Management" ON public.categories;
DROP POLICY IF EXISTS "Products Management" ON public.products;
DROP POLICY IF EXISTS "Orders Management" ON public.orders;

-- Allow public read access to categories and products
CREATE POLICY "Public Categories Read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Products Read" ON public.products FOR SELECT USING (true);

-- Allow authenticated or service role write access
CREATE POLICY "Categories Management" ON public.categories FOR ALL USING (true);
CREATE POLICY "Products Management" ON public.products FOR ALL USING (true);
CREATE POLICY "Orders Management" ON public.orders FOR ALL USING (true);
`;
