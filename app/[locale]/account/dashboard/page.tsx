'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { isAuthenticated, getCurrentCustomer, logout, type Customer } from '@/lib/auth';
import { getDashboardStats } from '@/lib/orders';
import type { DashboardStats } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const { locale } = use(params);
  const t = useTranslations('dashboard');
  const tc = useTranslations('common');
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/${locale}/login`);
      return;
    }

    const customerData = getCurrentCustomer();
    setCustomer(customerData);

    // Fetch dashboard stats
    getDashboardStats()
      .then((stats) => {
        setStats(stats);
      })
      .catch((error) => {
        console.error('Failed to fetch dashboard stats:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [locale, router]);

  const handleLogout = async () => {
    await logout();
    router.push(`/${locale}/login`);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-grow max-w-[1440px] mx-auto px-6 md:px-20 py-12 w-full">
          <div className="text-center py-12">
            <p className="text-charcoal/70">{t('loading')}</p>
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
              {t('welcome')}, {customer?.first_name}!
            </h1>
            <p className="text-charcoal/70">{t('subtitle')}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-charcoal text-charcoal rounded-md hover:bg-charcoal hover:text-white transition-colors"
          >
            {tc('logout')}
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-charcoal/60 mb-2">{t('stats.totalOrders')}</p>
              <p className="text-3xl font-bold text-charcoal">{stats.total_orders}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-charcoal/60 mb-2">{t('stats.pendingOrders')}</p>
              <p className="text-3xl font-bold text-charcoal">{stats.pending_orders}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-charcoal/60 mb-2">{t('stats.completedOrders')}</p>
              <p className="text-3xl font-bold text-charcoal">{stats.completed_orders}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-charcoal/60 mb-2">{t('stats.totalSpent')}</p>
              <p className="text-3xl font-bold text-charcoal">${stats.total_spent}</p>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href={`/${locale}/account/orders`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-serif font-bold text-charcoal mb-2">
              {t('quickLinks.orderHistory.title')}
            </h3>
            <p className="text-charcoal/70 text-sm">
              {t('quickLinks.orderHistory.description')}
            </p>
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6 opacity-50 cursor-not-allowed">
            <h3 className="text-xl font-serif font-bold text-charcoal mb-2">
              {t('quickLinks.addresses.title')}
            </h3>
            <p className="text-charcoal/70 text-sm">
              {t('quickLinks.addresses.description')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 opacity-50 cursor-not-allowed">
            <h3 className="text-xl font-serif font-bold text-charcoal mb-2">
              {t('quickLinks.settings.title')}
            </h3>
            <p className="text-charcoal/70 text-sm">
              {t('quickLinks.settings.description')}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

