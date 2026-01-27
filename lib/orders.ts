/**
 * Orders API functions
 */

import { get, post, type PaginatedResponse } from './api';
import type { Order, DashboardStats } from '../types';

/**
 * Get all orders for the authenticated customer
 */
export async function getOrders(params?: {
  status?: string;
  page?: number;
  per_page?: number;
}): Promise<PaginatedResponse<Order>> {
  const queryParams = new URLSearchParams();
  
  if (params?.status) queryParams.set('status', params.status);
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.per_page) queryParams.set('per_page', params.per_page.toString());
  
  const query = queryParams.toString();
  const endpoint = query ? `/orders?${query}` : '/orders';
  
  return get<PaginatedResponse<Order>>(endpoint);
}

/**
 * Get a specific order by order number
 */
export async function getOrder(orderNumber: string): Promise<Order> {
  const response = await get<{ data: Order }>(`/orders/${orderNumber}`);
  return response.data;
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderNumber: string): Promise<Order> {
  const response = await post<{ data: Order }>(`/orders/${orderNumber}/cancel`);
  return response.data;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  // This would need to be implemented in the backend
  // For now, we'll calculate from orders
  const orders = await getOrders({ per_page: 100 });
  
  const stats: DashboardStats = {
    total_orders: orders.meta.total,
    pending_orders: orders.data.filter(o => o.status === 'pending').length,
    completed_orders: orders.data.filter(o => o.status === 'delivered').length,
    total_spent: orders.data
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + parseFloat(order.total), 0)
      .toFixed(2),
  };
  
  return stats;
}

