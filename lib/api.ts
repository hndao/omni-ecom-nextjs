import { getLocale } from 'next-intl/server';
import type {
  Product,
  Category,
  PaginatedResponse,
  ProductsParams,
  CategoriesParams,
  ApiError,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'DYaOTulPEj2vJE8EDOzHEHqpHQXNC6mQ';
const CHANNEL_DOMAIN = process.env.NEXT_PUBLIC_CHANNEL_DOMAIN || 'localhost';

interface FetchOptions extends RequestInit {
  locale?: string;
}

/**
 * Fetch with locale and channel detection headers
 */
export async function fetchWithLocale(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { locale: optionsLocale, ...fetchOptions } = options;

  // Get locale from server context or use provided locale
  const locale = optionsLocale || (await getLocale());

  const headers = new Headers(fetchOptions.headers);

  // Locale headers
  headers.set('X-Locale', locale);
  headers.set('Accept-Language', locale);
  headers.set('Content-Type', 'application/json');

  // Channel detection headers (required by Laravel backend)
  headers.set('X-API-Key', API_KEY);
  headers.set('X-Channel-Domain', CHANNEL_DOMAIN);

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    next: { revalidate: 60 }, // Cache for 60 seconds
  });
}

/**
 * Handle API errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: 'Unknown Error',
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));

    console.error('API Error:', error);
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

/**
 * Get paginated products with filters
 */
export async function getProducts(
  params?: ProductsParams,
  locale?: string
): Promise<PaginatedResponse<Product>> {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const queryString = queryParams.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

  const response = await fetchWithLocale(endpoint, { locale });
  return handleResponse<PaginatedResponse<Product>>(response);
}

/**
 * Get single product by ID
 */
export async function getProduct(id: number, locale?: string): Promise<{ data: Product }> {
  const response = await fetchWithLocale(`/products/${id}`, { locale });
  return handleResponse<{ data: Product }>(response);
}

/**
 * Get categories with optional filters
 */
export async function getCategories(
  params?: CategoriesParams,
  locale?: string
): Promise<{ data: Category[] }> {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const queryString = queryParams.toString();
  const endpoint = `/categories${queryString ? `?${queryString}` : ''}`;

  const response = await fetchWithLocale(endpoint, { locale });
  return handleResponse<{ data: Category[] }>(response);
}

/**
 * Get single category by slug
 */
export async function getCategory(slug: string, locale?: string): Promise<{ data: Category }> {
  const response = await fetchWithLocale(`/categories/${slug}`, { locale });
  return handleResponse<{ data: Category }>(response);
}

/**
 * Get supported locales
 */
export async function getLocales(): Promise<{ data: { code: string; name: string }[] }> {
  const response = await fetchWithLocale('/locales');
  return handleResponse<{ data: { code: string; name: string }[] }>(response);
}
