// API Response Types for OmniStock

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  price: string;
  cost_price: string | null;
  status: 'active' | 'archived';
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;

  // Relationships
  inventory?: Inventory;
  categories?: Category[];
  images?: ProductImage[];
  translations?: ProductTranslation[];
  attributes?: ProductAttribute[];

  // Computed
  cover_image?: ProductImage;
  external_purchase_url?: string | null;
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

