// API Response Types for OmniStock

export interface ListingDetails {
  // Website channel details
  seo?: {
    title: string;
    description: string | null;
    keywords: string[];
  };
  shipping_info?: string | null;
  return_policy?: string | null;
  warranty_info?: string | null;
  custom_attributes?: Record<string, string | number | boolean>;
  is_featured?: boolean;
  badge?: string | null;

  // Etsy channel details
  shop_section?: string | null;
  tags?: string[];
  materials?: string[];
  processing_time?: string | null;
  listing_url?: string | null;

  // Shopify channel details
  vendor?: string | null;
  product_type?: string | null;
  handle?: string | null;

  // Amazon channel details
  asin?: string | null;
  bullet_points?: string[];
  brand?: string | null;
  fulfillment?: string | null;
}

export interface Product {
  id: number;
  sku?: string; // Optional for listings
  name?: string; // Optional for listings
  title?: string; // For listings
  slug?: string; // For listings
  description: string | null;
  price: string;
  cost_price?: string | null;
  status: 'active' | 'archived';
  metadata?: Record<string, any> | null;
  created_at: string;
  updated_at: string;

  // Listing-specific fields
  mapping_type?: 'bundle' | 'variant';
  calculated_quantity?: number;
  external_id?: string;
  url?: string | null;

  // Relationships
  inventory?: Inventory;
  categories?: Category[];
  images?: ProductImage[];
  translations?: ProductTranslation[];
  attributes?: ProductAttribute[];
  products?: Product[]; // For listings that contain multiple products

  // Computed
  cover_image?: ProductImage;
  external_purchase_url?: string | null;

  // Channel-specific listing details
  listing_details?: ListingDetails;
}

export interface ProductTranslation {
  id: number;
  product_id: number;
  locale: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: number;
  product_id: number;
  on_hand: number;
  reserved: number;
  available: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  sort_order: number;
  is_active: boolean;
  show_on_website: boolean;
  created_at: string;
  updated_at: string;
  
  // Relationships
  translations?: CategoryTranslation[];
  products?: Product[];
  children?: Category[];
  parent?: Category;
  
  // Computed
  product_count?: number;
}

export interface CategoryTranslation {
  id: number;
  category_id: number;
  locale: string;
  name: string;
  description: string | null;
  slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  file_hash: string;
  storage_path: string;
  storage_url: string;
  thumbnail_url: string | null;
  filename: string;
  mime_type: string;
  size: number;
  width: number | null;
  height: number | null;
  uploaded_by: number | null;
  created_at: string;
  updated_at: string;
  
  // Pivot data (from product_images table)
  pivot?: {
    product_id: number;
    image_id: number;
    sort_order: number;
    is_cover: boolean;
  };
  
  // Computed
  is_cover?: boolean;
  sort_order?: number;
}

export interface ProductAttribute {
  name: string;
  value: string | number | boolean;
  data_type: 'text' | 'number' | 'boolean' | 'select';
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  debug?: Record<string, any>;
}

// API Request Parameters
export interface ProductsParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  status?: 'active' | 'archived';
  min_price?: number;
  max_price?: number;
  sort?: 'name' | 'price' | 'created_at';
  order?: 'asc' | 'desc';
}

export interface CategoriesParams {
  parent_id?: number | null;
  status?: 'active' | 'inactive';
  show_on_website?: boolean;
}

