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

export function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    department: row.department,
    category: row.category,
    subcategory: row.subcategory || undefined,
    brand: row.brand,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    oldPrice: row.old_price ? Number(row.old_price) : undefined,
    rating: row.rating ? Number(row.rating) : 5.0,
    reviewCount: row.review_count || 0,
    images: Array.isArray(row.images) ? row.images : [],
    badges: Array.isArray(row.badges) ? row.badges : [],
    stock: Number(row.stock || 0),
    isBestSeller: Boolean(row.is_best_seller),
    isNew: Boolean(row.is_new),
    isFeatured: Boolean(row.is_featured),
    specs: Array.isArray(row.specs) ? row.specs : [],
    keySpec: row.key_spec || undefined,
    colors: Array.isArray(row.colors) ? row.colors : [],
    material: row.material || undefined,
    bagType: row.bag_type || undefined,
    closure: row.closure || undefined,
    dimensions: row.dimensions || undefined,
    careInstructions: row.care_instructions || undefined,
    whatsIncluded: Array.isArray(row.whats_included) ? row.whats_included : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapProductToRow(p: Product): any {
  return {
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
  };
}

export function mapRowToCategory(row: any): Category {
  return {
    id: row.id,
    slug: row.slug,
    department: row.department,
    name: row.name,
    image: row.image,
    description: row.description || undefined,
    subcategories: Array.isArray(row.subcategories) ? row.subcategories : [],
  };
}

export function mapCategoryToRow(c: Category): any {
  return {
    id: c.id,
    slug: c.slug,
    department: c.department,
    name: c.name,
    image: c.image,
    description: c.description || null,
    subcategories: c.subcategories || [],
  };
}

export async function fetchSupabaseProducts(): Promise<Product[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching products from Supabase:', error);
      return null;
    }
    return (data || []).map(mapRowToProduct);
  } catch (err) {
    console.warn('Failed to query Supabase products:', err);
    return null;
  }
}

export async function fetchSupabaseCategories(): Promise<Category[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client.from('categories').select('*');
    if (error) {
      console.warn('Error fetching categories from Supabase:', error);
      return null;
    }
    return (data || []).map(mapRowToCategory);
  } catch (err) {
    console.warn('Failed to query Supabase categories:', err);
    return null;
  }
}

export async function upsertSupabaseProduct(p: Product): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const row = mapProductToRow(p);
    const { error } = await client.from('products').upsert(row, { onConflict: 'id' });
    if (error) {
      console.error('Failed to upsert product in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to upsert product in Supabase:', err);
    return false;
  }
}

export async function deleteSupabaseProduct(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client.from('products').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete product from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete product from Supabase:', err);
    return false;
  }
}

export async function upsertSupabaseCategory(c: Category): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const row = mapCategoryToRow(c);
    const { error } = await client.from('categories').upsert(row, { onConflict: 'id' });
    if (error) {
      console.error('Failed to upsert category in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to upsert category in Supabase:', err);
    return false;
  }
}

export async function deleteSupabaseCategory(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client.from('categories').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete category from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete category from Supabase:', err);
    return false;
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
