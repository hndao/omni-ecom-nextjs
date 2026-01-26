'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { isAuthenticated } from '@/lib/auth';
import { getOrders, type Order } from '@/lib/orders';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const { locale } = use(params);
  const t = useTranslations('orders');
  const tc = useTranslations('common');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/${locale}/login`);
      return;
    }

    fetchOrders();
  }, [locale, router, statusFilter]);

  const fetchOrders = async () => {
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await getOrders(params);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
            <p className="text-charcoal/70">{t('loadingOrders')}</p>
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
            href={`/${locale}/account/dashboard`}
            className="text-primary hover:underline mb-4 inline-block"
          >
            ← {tc('backToDashboard')}
          </Link>
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
            {t('title')}
          </h1>
          <p className="text-charcoal/70">{t('subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </form>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">{t('allOrders')}</option>
            <option value="pending">{t('status.pending')}</option>
            <option value="processing">{t('status.processing')}</option>
            <option value="shipped">{t('status.shipped')}</option>
            <option value="delivered">{t('status.delivered')}</option>
            <option value="cancelled">{t('status.cancelled')}</option>
          </select>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-charcoal/70 mb-4">{t('noOrdersFound')}</p>
            <Link
              href={`/${locale}/shop`}
              className="inline-block px-6 py-3 bg-charcoal text-white rounded-md hover:bg-charcoal/90 transition-colors"
            >
              {t('startShopping')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-charcoal mb-1">
                      {t('orderNumber')} #{order.order_number}
                    </h3>
                    <p className="text-sm text-charcoal/60">
                      {t('placedOn')} {formatDate(order.created_at)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {t(`status.${order.status}`)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-charcoal/70 text-sm">
                      {order.items?.length || 0} {order.items?.length === 1 ? t('items') : t('itemsPlural')}
                    </p>
                    <p className="text-lg font-bold text-charcoal">${order.total}</p>
                  </div>
                  <Link
                    href={`/${locale}/account/orders/${order.order_number}`}
                    className="px-6 py-2 border border-charcoal text-charcoal rounded-md hover:bg-charcoal hover:text-white transition-colors"
                  >
                    {t('viewDetails')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

