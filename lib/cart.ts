/**
 * Cart API functions
 */

import { get, post, put, del } from './api';

export interface CartItem {
  id: number;
  customer_id?: number;
  session_id?: string;
  listing_id: number;
  quantity: number;
  price: string;
  subtotal: number;
  listing: {
    id: number;
    title: string;
    slug: string;
    price: string;
    images?: Array<{
      id: number;
      storage_url: string;
      alt_text?: string;
    }>;
  };
  created_at: string;
  updated_at: string;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  item_count: number;
}

export interface CartResponse {
  items: CartItem[];
  summary: CartSummary;
}

/**
 * Get session ID for guest users
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Get cart items
 */
export async function getCart(): Promise<CartResponse> {
  const sessionId = getSessionId();
  const response = await get<{ data: CartResponse }>('/cart', {
    headers: {
      'X-Session-ID': sessionId,
    },
  });
  return response.data;
}

/**
 * Add item to cart
 */
export async function addToCart(listingId: number, quantity: number = 1): Promise<CartItem> {
  const sessionId = getSessionId();
  const response = await post<{ data: CartItem }>('/cart', {
    listing_id: listingId,
    quantity,
  }, {
    headers: {
      'X-Session-ID': sessionId,
    },
  });
  return response.data;
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
  const sessionId = getSessionId();
  const response = await put<{ data: CartItem }>(`/cart/${itemId}`, {
    quantity,
  }, {
    headers: {
      'X-Session-ID': sessionId,
    },
  });
  return response.data;
}

/**
 * Remove item from cart
 */
export async function removeFromCart(itemId: number): Promise<void> {
  const sessionId = getSessionId();
  await del(`/cart/${itemId}`, {
    headers: {
      'X-Session-ID': sessionId,
    },
  });
}

/**
 * Clear all cart items
 */
export async function clearCart(): Promise<void> {
  const sessionId = getSessionId();
  await del('/cart', {
    headers: {
      'X-Session-ID': sessionId,
    },
  });
}

/**
 * Apply coupon code
 */
export async function applyCoupon(code: string): Promise<any> {
  const sessionId = getSessionId();
  const response = await post('/cart/apply-coupon', {
    code,
  }, {
    headers: {
      'X-Session-ID': sessionId,
    },
  });
  return response;
}

