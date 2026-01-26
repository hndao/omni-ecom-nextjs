import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyCoupon, getSessionId } from '@/lib/cart';

// Mock fetch
global.fetch = jest.fn();

describe('Cart API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('getSessionId', () => {
    it('should generate a new session ID if none exists', () => {
      const sessionId = getSessionId();
      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(sessionId.length).toBeGreaterThan(0);
    });

    it('should return existing session ID from localStorage', () => {
      const existingId = 'test-session-id';
      localStorage.setItem('cart_session_id', existingId);
      const sessionId = getSessionId();
      expect(sessionId).toBe(existingId);
    });

    it('should store session ID in localStorage', () => {
      const sessionId = getSessionId();
      expect(localStorage.getItem('cart_session_id')).toBe(sessionId);
    });
  });

  describe('getCart', () => {
    it('should fetch cart items successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          items: [
            {
              id: 1,
              listing_id: 1,
              quantity: 2,
              price: '29.99',
              listing: {
                id: 1,
                title: 'Test Product',
                images: [],
              },
            },
          ],
          summary: {
            subtotal: 59.98,
            tax: 5.40,
            shipping: 10.00,
            total: 75.38,
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const cart = await getCart();
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].listing.title).toBe('Test Product');
      expect(cart.summary.total).toBe(75.38);
    });

    it('should include session ID in request headers', async () => {
      const mockResponse = {
        success: true,
        data: { items: [], summary: { subtotal: 0, tax: 0, shipping: 0, total: 0 } },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await getCart();
      
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const headers = fetchCall[1].headers;
      expect(headers.get('X-Session-ID')).toBeDefined();
    });
  });

  describe('addToCart', () => {
    it('should add item to cart successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Item added to cart',
        data: {
          id: 1,
          listing_id: 1,
          quantity: 1,
          price: '29.99',
          subtotal: 29.99,
          listing: {
            id: 1,
            title: 'Test Product',
            slug: 'test-product',
            price: '29.99',
          },
          created_at: '2026-01-26',
          updated_at: '2026-01-26',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await addToCart(1, 1);
      expect(result.id).toBe(1);
      expect(result.listing_id).toBe(1);
    });

    it('should send correct request body', async () => {
      const mockResponse = { success: true, data: {} };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await addToCart(123, 5);
      
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.listing_id).toBe(123);
      expect(body.quantity).toBe(5);
    });
  });

  describe('updateCartItem', () => {
    it('should update cart item quantity', async () => {
      const mockResponse = {
        success: true,
        message: 'Cart updated',
        data: {
          id: 1,
          listing_id: 1,
          quantity: 3,
          price: '29.99',
          subtotal: 89.97,
          listing: {
            id: 1,
            title: 'Test Product',
            slug: 'test-product',
            price: '29.99',
          },
          created_at: '2026-01-26',
          updated_at: '2026-01-26',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await updateCartItem(1, 3);
      expect(result.quantity).toBe(3);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      const mockResponse = {
        success: true,
        message: 'Item removed from cart',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await removeFromCart(1);
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});

