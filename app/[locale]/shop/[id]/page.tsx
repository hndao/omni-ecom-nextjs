import { Suspense } from 'react';
import { getListing, getRelatedListings } from '@/lib/api';
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
    const [listingResponse, relatedResponse] = await Promise.all([
      getListing(identifier, locale),
      getRelatedListings(identifier, 4, locale).catch(() => ({ data: [] })), // Gracefully handle errors
    ]);

    const listing = listingResponse.data;
    const relatedProducts = relatedResponse.data;

    return <ProductDetailClient product={listing} relatedProducts={relatedProducts} locale={locale} />;
  } catch (error) {
    console.error('Failed to fetch listing:', error);
    notFound();
  }
}

