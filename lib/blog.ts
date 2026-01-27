import { get } from './api';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  published_at: string;
  views_count: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  author: {
    id: number;
    name: string;
  };
  featured_image: {
    url: string;
    alt: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  posts_count: number;
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

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface BlogPostsResponse {
  data: BlogPost[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface BlogPostParams {
  per_page?: number;
  page?: number;
  category?: string;
  tag?: string;
  search?: string;
  sort?: 'date' | 'popularity';
}

/**
 * Get blog posts with optional filters
 */
export async function getBlogPosts(params: BlogPostParams = {}): Promise<BlogPostsResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.category) queryParams.append('category', params.category);
  if (params.tag) queryParams.append('tag', params.tag);
  if (params.search) queryParams.append('search', params.search);
  if (params.sort === 'popularity') queryParams.append('sort', 'views_count');
  
  const url = `/blog/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return get<BlogPostsResponse>(url);
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost> {
  return get<BlogPost>(`/blog/posts/${slug}`);
}

/**
 * Get all blog categories
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  const response = await get<{ data: BlogCategory[] }>('/blog/categories?per_page=100');
  return response.data;
}

/**
 * Get all blog tags
 */
export async function getBlogTags(): Promise<BlogTag[]> {
  const response = await get<{ data: BlogTag[] }>('/blog/tags?per_page=100');
  return response.data;
}

/**
 * Format blog post date
 */
export function formatBlogDate(dateString: string, locale: string = 'en'): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Get reading time estimate (words per minute)
 */
export function getReadingTime(content: string, wordsPerMinute: number = 200): number {
  const text = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

