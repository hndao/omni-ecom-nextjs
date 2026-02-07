import { get } from './api';
import type { Product, Category } from '@/types';

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface ListingsResponse {
  data: Product[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface CategoriesResponse {
  data: Category[];
  meta?: PaginationMeta;
  links?: PaginationLinks;
}

export interface ListingResponse {
  data: Product;
}

export interface ListingsParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  status?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  featured?: boolean;
  limit?: number;
}

export interface CategoriesParams {
  show_on_website?: boolean;
  status?: string;
  per_page?: number;
}

/**
 * Get listings (products) with optional filters
 */
export async function getListings(
  params: ListingsParams = {},
  locale?: string
): Promise<ListingsResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.category) queryParams.append('category', params.category);
  if (params.status) queryParams.append('status', params.status);
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.order) queryParams.append('order', params.order);
  if (params.featured !== undefined) queryParams.append('featured', params.featured ? 'true' : 'false');
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (locale) queryParams.append('locale', locale);
  
  const url = `/listings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return get<ListingsResponse>(url);
}

/**
 * Get a single listing by ID or slug
 */
export async function getListing(
  identifier: string | number,
  locale?: string
): Promise<ListingResponse> {
  const queryParams = new URLSearchParams();
  if (locale) queryParams.append('locale', locale);
  
  const url = `/listings/${identifier}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return get<ListingResponse>(url);
}

/**
 * Get related listings for a product
 */
export async function getRelatedListings(
  identifier: string | number,
  limit: number = 4,
  locale?: string
): Promise<ListingsResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append('limit', limit.toString());
  if (locale) queryParams.append('locale', locale);
  
  const url = `/listings/${identifier}/related?${queryParams.toString()}`;
  return get<ListingsResponse>(url);
}

/**
 * Get categories with optional filters
 */
export async function getCategories(
  params: CategoriesParams = {},
  locale?: string
): Promise<CategoriesResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.show_on_website !== undefined) {
    queryParams.append('show_on_website', params.show_on_website ? '1' : '0');
  }
  if (params.status) queryParams.append('status', params.status);
  if (params.per_page) queryParams.append('per_page', params.per_page.toString());
  if (locale) queryParams.append('locale', locale);
  
  const url = `/categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return get<CategoriesResponse>(url);
}

/**
 * Get a single category by slug
 */
export async function getCategory(
  slug: string,
  locale?: string
): Promise<{ data: Category }> {
  const queryParams = new URLSearchParams();
  if (locale) queryParams.append('locale', locale);
  
  const url = `/categories/${slug}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return get<{ data: Category }>(url);
}

/**
 * Get featured listings (non-paginated)
 */
export async function getFeaturedListings(
  limit: number = 6,
  locale?: string
): Promise<Product[]> {
  const queryParams = new URLSearchParams();
  queryParams.append('featured', 'true');
  queryParams.append('limit', limit.toString());
  if (locale) queryParams.append('locale', locale);

  const url = `/listings?${queryParams.toString()}`;
  const response = await get<{ success: boolean; data: Product[] }>(url);
  return response.data ?? [];
}

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

