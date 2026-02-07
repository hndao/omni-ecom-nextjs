import { get } from './api';
import type { ApiResponse } from './api';
import type { Testimonial } from '@/types';

/**
 * Get published testimonials
 */
export async function getTestimonials(
  limit: number = 4
): Promise<Testimonial[]> {
  const response = await get<ApiResponse<Testimonial[]>>(
    `/testimonials?status=published&limit=${limit}`
  );
  return response.data ?? [];
}
