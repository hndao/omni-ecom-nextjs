import { Suspense } from 'react';
import { getListing } from '@/lib/api';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  // ID can be numeric ID or slug
  const listingId = parseInt(id, 10);
  const identifier = isNaN(listingId) ? id : listingId;

  try {
    const response = await getListing(identifier, locale);
    const listing = response.data;

    return <ProductDetailClient product={listing} locale={locale} />;
  } catch (error) {
    console.error('Failed to fetch listing:', error);
    notFound();
  }
}

