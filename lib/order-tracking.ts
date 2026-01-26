/**
 * Order Tracking API functions
 */

import { post } from './api';
import type { Order } from '../types';

export interface TrackOrderRequest {
  order_number: string;
  email: string;
}

export interface OrderTimeline {
  status: string;
  label: string;
  date: string | null;
  completed: boolean;
  current: boolean;
}

/**
 * Track an order by order number and email
 */
export async function trackOrder(data: TrackOrderRequest): Promise<Order> {
  const response = await post<{ data: Order }>('/orders/track', data);
  return response.data;
}

/**
 * Get order status timeline
 */
export function getOrderTimeline(order: Order): OrderTimeline[] {
  const statuses: OrderTimeline[] = [
    {
      status: 'pending',
      label: 'Order Placed',
      date: order.created_at,
      completed: true,
      current: order.status === 'pending',
    },
    {
      status: 'processing',
      label: 'Processing',
      date: order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' 
        ? order.updated_at 
        : null,
      completed: ['processing', 'shipped', 'delivered'].includes(order.status),
      current: order.status === 'processing',
    },
    {
      status: 'shipped',
      label: 'Shipped',
      date: order.status === 'shipped' || order.status === 'delivered' 
        ? order.updated_at 
        : null,
      completed: ['shipped', 'delivered'].includes(order.status),
      current: order.status === 'shipped',
    },
    {
      status: 'delivered',
      label: 'Delivered',
      date: order.completed_at,
      completed: order.status === 'delivered',
      current: order.status === 'delivered',
    },
  ];

  // If order is cancelled, show different timeline
  if (order.status === 'cancelled') {
    return [
      {
        status: 'pending',
        label: 'Order Placed',
        date: order.created_at,
        completed: true,
        current: false,
      },
      {
        status: 'cancelled',
        label: 'Cancelled',
        date: order.cancelled_at,
        completed: true,
        current: true,
      },
    ];
  }

  return statuses;
}

/**
 * Get carrier tracking URL (placeholder - would need real carrier integration)
 */
export function getCarrierTrackingUrl(carrier: string, trackingNumber: string): string {
  const carriers: Record<string, string> = {
    'ups': `https://www.ups.com/track?tracknum=${trackingNumber}`,
    'fedex': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    'usps': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
    'dhl': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
  };

  return carriers[carrier.toLowerCase()] || '#';
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate order number format
 */
export function validateOrderNumber(orderNumber: string): boolean {
  // Order numbers should not be empty and should have a minimum length
  return orderNumber.trim().length >= 3;
}

