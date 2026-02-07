import { post } from './api';
import type { ApiResponse } from './api';

/**
 * Subscribe to the newsletter
 */
export async function subscribeToNewsletter(
  email: string,
  source: string = 'home_page'
): Promise<{ message: string }> {
  const response = await post<ApiResponse<null>>('/newsletter/subscribe', {
    email,
    source,
  });
  return { message: response.message ?? 'Successfully subscribed!' };
}
