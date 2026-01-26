'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { getCart, updateCartItem, removeFromCart, clearCart, type CartItem, type CartSummary } from '@/lib/cart';

export default function CartClient() {
  const t = useTranslations('cart');
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const cart = await getCart();
      setItems(cart.items);
      setSummary(cart.summary);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateQuantity(itemId: number, newQuantity: number) {
    if (newQuantity < 1) return;
    
    setUpdating(itemId);
    try {
      await updateCartItem(itemId, newQuantity);
      await loadCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdating(null);
    }
  }

  async function handleRemoveItem(itemId: number) {
    setUpdating(itemId);
    try {
      await removeFromCart(itemId);
      await loadCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setUpdating(null);
    }
  }

  async function handleClearCart() {
    if (!confirm(t('confirmClear'))) return;
    
    setLoading(true);
    try {
      await clearCart();
      await loadCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('empty')}</h2>
        <p className="text-gray-600 mb-6">{t('emptyDescription')}</p>
        <button
          onClick={() => router.push('/shop')}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t('continueShopping')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('title')}</h2>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            {t('clearCart')}
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0">
                {item.listing.images && item.listing.images.length > 0 ? (
                  <img
                    src={item.listing.images[0].storage_url}
                    alt={item.listing.images[0].alt_text || item.listing.title}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.listing.title}</h3>
                <p className="text-sm text-gray-600 mt-1">${item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={updating === item.id || item.quantity <= 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={updating === item.id}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveItem(item.id)}
                disabled={updating === item.id}
                className="text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
          <h3 className="text-lg font-semibold mb-4">{t('orderSummary')}</h3>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('subtotal')}</span>
              <span className="font-medium">${summary?.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('shipping')}</span>
              <span className="font-medium">${summary?.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('tax')}</span>
              <span className="font-medium">${summary?.tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-semibold">{t('total')}</span>
              <span className="font-bold text-lg">${summary?.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            {t('proceedToCheckout')}
            <ArrowRight className="h-5 w-5" />
          </button>

          <button
            onClick={() => router.push('/shop')}
            className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
          >
            {t('continueShopping')}
          </button>
        </div>
      </div>
    </div>
  );
}

