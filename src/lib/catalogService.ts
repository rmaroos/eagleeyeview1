import { supabase } from './supabase';
import type { Product, Category, Department } from '@/data/catalog';

export function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    department: row.department as Department,
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
  };
}

export function mapRowToCategory(row: any): Category {
  return {
    id: row.id,
    slug: row.slug,
    department: row.department as Department,
    name: row.name,
    image: row.image,
    description: row.description || undefined,
    subcategories: Array.isArray(row.subcategories) ? row.subcategories : [],
  };
}

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
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

export async function fetchCategoriesFromSupabase(): Promise<Category[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('categories').select('*');
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

export function subscribeToCatalogChanges(onChange: () => void): () => void {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('storefront-catalog-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
      onChange();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
      onChange();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
