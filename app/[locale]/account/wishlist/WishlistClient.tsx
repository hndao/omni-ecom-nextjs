'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Trash2, Share2, X } from 'lucide-react';
import { getWishlist, removeFromWishlist, clearWishlist, type WishlistItem } from '@/lib/wishlist';
import { addToCart } from '@/lib/cart';
import Image from 'next/image';

export default function WishlistClient() {
  const t = useTranslations('wishlist');
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingItems, setProcessingItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    try {
      const data = await getWishlist();
      setItems(data.items);
    } catch (err: any) {
      setError(err.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveItem(itemId: number) {
    if (!confirm(t('confirmRemove'))) return;

    setProcessingItems(prev => new Set(prev).add(itemId));

    try {
      await removeFromWishlist(itemId);
      setItems(items.filter(item => item.id !== itemId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove item');
    } finally {
      setProcessingItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  }

  async function handleMoveToCart(item: WishlistItem) {
    setProcessingItems(prev => new Set(prev).add(item.id));

    try {
      await addToCart(item.listing_id, 1);
      await removeFromWishlist(item.id);
      setItems(items.filter(i => i.id !== item.id));
      alert(t('movedToCart'));
    } catch (err: any) {
      alert(err.message || 'Failed to move to cart');
    } finally {
      setProcessingItems(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  }

  async function handleClearWishlist() {
    if (!confirm(t('confirmClear'))) return;

    setLoading(true);

    try {
      await clearWishlist();
      setItems([]);
    } catch (err: any) {
      alert(err.message || 'Failed to clear wishlist');
    } finally {
      setLoading(false);
    }
  }

  function handleShareWishlist() {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: t('shareTitle'),
        text: t('shareText'),
        url: url,
      }).catch(() => {
        // Fallback to copy to clipboard
        copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert(t('linkCopied'));
    }).catch(() => {
      alert(t('copyFailed'));
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadWishlist}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('empty')}</h2>
        <p className="text-gray-600 mb-6">{t('emptyDescription')}</p>
        <button
          onClick={() => router.push('/shop')}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <div className="flex gap-3">
          <button
            onClick={handleShareWishlist}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Share2 className="h-5 w-5" />
            {t('share')}
          </button>
          <button
            onClick={handleClearWishlist}
            className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
            {t('clearAll')}
          </button>
        </div>
      </div>

      {/* Item Count */}
      <p className="text-gray-600 mb-6">
        {items.length} {items.length === 1 ? t('item') : t('items')}
      </p>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => {
          const isProcessing = processingItems.has(item.id);
          const imageUrl = item.listing.images?.[0]?.storage_url || '/placeholder.png';

          return (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={imageUrl}
                  alt={item.listing.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isProcessing}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 disabled:opacity-50"
                  title={t('remove')}
                >
                  <X className="h-5 w-5 text-red-600" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3
                  className="font-medium text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600"
                  onClick={() => router.push(`/shop/${item.listing.slug}`)}
                >
                  {item.listing.title}
                </h3>
                <p className="text-lg font-bold text-gray-900 mb-4">
                  ${parseFloat(item.listing.price).toFixed(2)}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {t('addToCart')}
                  </button>
                  <button
                    onClick={() => router.push(`/shop/${item.listing.slug}`)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    {t('view')}
                  </button>
                </div>
              </div>

              {/* Added Date */}
              <div className="px-4 pb-3 text-xs text-gray-500">
                {t('addedOn')} {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

