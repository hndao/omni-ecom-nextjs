/**
 * Wishlist API functions
 */

import { get, post, del } from './api';

export interface WishlistItem {
  id: number;
  customer_id: number;
  listing_id: number;
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

export interface WishlistResponse {
  items: WishlistItem[];
  count: number;
}

/**
 * Get all wishlist items
 */
export async function getWishlist(): Promise<WishlistResponse> {
  const response = await get<{ data: WishlistResponse }>('/wishlist');
  return response.data;
}

/**
 * Add item to wishlist
 */
export async function addToWishlist(listingId: number): Promise<WishlistItem> {
  const response = await post<{ data: WishlistItem }>('/wishlist', {
    listing_id: listingId,
  });
  return response.data;
}

/**
 * Remove item from wishlist
 */
export async function removeFromWishlist(itemId: number): Promise<void> {
  await del(`/wishlist/${itemId}`);
}

/**
 * Clear all wishlist items
 */
export async function clearWishlist(): Promise<void> {
  await del('/wishlist');
}

/**
 * Check if a listing is in the wishlist
 */
export async function isInWishlist(listingId: number): Promise<boolean> {
  const response = await get<{ data: { in_wishlist: boolean } }>(`/wishlist/check/${listingId}`);
  return response.data.in_wishlist;
}

