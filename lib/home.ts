import { get } from './api';
import type { ApiResponse } from './api';
import type { HomePageData } from '@/types';

/**
 * Get home page data (hero content, section titles)
 */
export async function getHomePageData(): Promise<HomePageData> {
  const response = await get<ApiResponse<HomePageData>>('/home');
  return response.data!;
}
