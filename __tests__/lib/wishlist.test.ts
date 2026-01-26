import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist } from '@/lib/wishlist';

// Mock fetch
global.fetch = jest.fn();

describe('Wishlist API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWishlist', () => {
    it('should fetch wishlist items successfully', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: 1,
            listing_id: 1,
            listing: {
              id: 1,
              title: 'Wishlist Product',
              price: '49.99',
              images: [],
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const wishlist = await getWishlist();
      expect(wishlist).toHaveLength(1);
      expect(wishlist[0].listing.title).toBe('Wishlist Product');
    });

    it('should handle empty wishlist', async () => {
      const mockResponse = {
        success: true,
        data: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const wishlist = await getWishlist();
      expect(wishlist).toHaveLength(0);
    });
  });

  describe('addToWishlist', () => {
    it('should add item to wishlist successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Item added to wishlist',
        data: {
          id: 1,
          listing_id: 1,
          listing: {
            id: 1,
            title: 'Wishlist Product',
            price: '49.99',
            images: [],
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await addToWishlist(1);
      expect(result.id).toBe(1);
      expect(result.listing_id).toBe(1);
    });

    it('should send correct request body', async () => {
      const mockResponse = { success: true, data: {} };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await addToWishlist(123);
      
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.listing_id).toBe(123);
    });
  });

  describe('removeFromWishlist', () => {
    it('should remove item from wishlist', async () => {
      const mockResponse = {
        success: true,
        message: 'Item removed from wishlist',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await removeFromWishlist(1);
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('clearWishlist', () => {
    it('should clear all wishlist items', async () => {
      const mockResponse = {
        success: true,
        message: 'Wishlist cleared',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await clearWishlist();
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('isInWishlist', () => {
    it('should return true if item is in wishlist', async () => {
      const mockResponse = {
        success: true,
        data: { in_wishlist: true },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await isInWishlist(1);
      expect(result).toBe(true);
    });

    it('should return false if item is not in wishlist', async () => {
      const mockResponse = {
        success: true,
        data: { in_wishlist: false },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await isInWishlist(1);
      expect(result).toBe(false);
    });
  });
});

