/**
 * TypeScript type definitions for the application
 */

export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  type: 'registered' | 'guest';
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerAddress {
  id: number;
  customer_id: number;
  type: 'billing' | 'shipping';
  first_name: string;
  last_name: string;
  company: string | null;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  listing_id: number | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  price: string;
  total: string;
  product_snapshot: unknown;
}

export interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: string;
  tax: string;
  shipping: string;
  discount: string;
  total: string;
  currency: string;
  customer?: Customer;
  billing_address?: CustomerAddress;
  shipping_address?: CustomerAddress;
  items?: OrderItem[];
  customer_notes: string | null;
  payment_method: string | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  paid_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface AuthResponse {
  customer: Customer;
  token: string;
}

export interface DashboardStats {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_spent: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number | null;
  image_url?: string | null;
  show_on_website: boolean;
  status: 'active' | 'inactive';
  translations?: CategoryTranslation[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  url?: string;
  storage_url?: string;
  alt?: string;
  is_primary?: boolean;
  is_cover?: boolean;
  pivot?: {
    is_cover?: boolean;
    is_primary?: boolean;
  };
}

export interface ProductTranslation {
  locale: string;
  name: string;
  description?: string;
  short_description?: string;
}

export interface CategoryTranslation {
  locale: string;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  title?: string; // For listings
  slug: string;
  sku: string;
  description?: string;
  short_description?: string;
  price: string;
  sale_price?: string | null;
  cost?: string;
  stock_quantity: number;
  low_stock_threshold?: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  is_featured: boolean;
  category?: Category;
  category_id?: number;
  categories?: Category[];
  images?: ProductImage[];
  featured_image?: ProductImage | null;
  products?: Product[]; // For listings with variants/bundles
  mapping_type?: 'single' | 'bundle' | 'variant'; // For listings
  inventory?: {
    available: number;
    reserved: number;
    total: number;
  };
  external_purchase_url?: string | null;
  metadata?: Record<string, any>;
  listing_details?: {
    badge?: string;
    shipping_info?: string;
    return_policy?: string;
    warranty_info?: string;
    custom_attributes?: Record<string, any>;
    processing_time?: string;
    materials?: string[];
  };
  translations?: ProductTranslation[];
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface ListingDetails extends Product {
  // Additional fields specific to listing details
  related_products?: Product[];
}

