import { Suspense } from 'react';
import { getProduct } from '@/lib/api';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  
  // Validate ID is a number
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    notFound();
  }

  try {
    const response = await getProduct(productId, locale);
    const product = response.data;

    return <ProductDetailClient product={product} locale={locale} />;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    notFound();
  }
}

