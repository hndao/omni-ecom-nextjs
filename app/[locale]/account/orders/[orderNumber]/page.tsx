'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { isAuthenticated } from '@/lib/auth';
import { getOrder, cancelOrder } from '@/lib/orders';
import type { Order } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrderDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; orderNumber: string }> 
}) {
  const router = useRouter();
  const { locale, orderNumber } = use(params);
  const t = useTranslations('orders');
  const tc = useTranslations('common');
  const te = useTranslations('errors');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/${locale}/login`);
      return;
    }

    fetchOrder();
  }, [locale, orderNumber, router]);

  const fetchOrder = async () => {
    try {
      const order = await getOrder(orderNumber);
      setOrder(order);
    } catch (err: any) {
      setError(err.message || te('failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await cancelOrder(orderNumber);
      fetchOrder(); // Refresh order data
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-grow max-w-[1440px] mx-auto px-6 md:px-20 py-12 w-full">
          <div className="text-center py-12">
            <p className="text-charcoal/70">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <main className="flex-grow max-w-[1440px] mx-auto px-6 md:px-20 py-12 w-full">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error || te('orderNotFound')}</p>
            <Link
              href={`/${locale}/account/orders`}
              className="text-primary hover:underline"
            >
              ← {tc('backToOrders')}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow max-w-[1440px] mx-auto px-6 md:px-20 py-12 w-full">
        <div className="mb-8">
          <Link
            href={`/${locale}/account/orders`}
            className="text-primary hover:underline mb-4 inline-block"
          >
            ← {tc('backToOrders')}
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
                {t('orderNumber')} #{order.order_number}
              </h1>
              <p className="text-charcoal/70">
                {t('placedOn')} {formatDate(order.created_at)}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {t(`status.${order.status}`)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">
                {t('orderItems')}
              </h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-0">
                    <div>
                      <h3 className="font-medium text-charcoal">{item.product_name}</h3>
                      <p className="text-sm text-charcoal/60">{t('sku')}: {item.product_sku}</p>
                      <p className="text-sm text-charcoal/60">
                        {t('quantity')}: {item.quantity} × ${item.price} {t('each')}
                      </p>
                    </div>
                    <p className="font-bold text-charcoal">${item.total}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">
                {t('orderSummary')}
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-charcoal/70">
                  <span>{t('subtotal')}</span>
                  <span>${order.subtotal}</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>{t('shipping')}</span>
                  <span>${order.shipping}</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>{t('tax')}</span>
                  <span>${order.tax}</span>
                </div>
                {parseFloat(order.discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('discount')}</span>
                    <span>-${order.discount}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold text-charcoal">
                    <span>{t('total')}</span>
                    <span>${order.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {order.status === 'pending' && (
              <button
                onClick={handleCancelOrder}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {t('cancelOrder')}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

