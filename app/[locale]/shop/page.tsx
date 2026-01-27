import { Suspense } from 'react';
import { getListings, getCategories } from '@/lib/products';
import ShopClient from './ShopClient';
import type { Product, Category } from '@/types';

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  // Extract query parameters
  const page = Number(resolvedSearchParams.page) || 1;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'created_at';
  const order = typeof resolvedSearchParams.order === 'string' ? resolvedSearchParams.order : 'desc';

  // Fetch data from API - using listings instead of products
  const [listingsResponse, categoriesResponse] = await Promise.all([
    getListings(
      {
        page,
        per_page: 12,
        search,
        category,
        status: 'active',
        sort: sort as any,
        order: order as any,
      },
      locale
    ),
    getCategories(
      {
        show_on_website: true,
        status: 'active',
      },
      locale
    ),
  ]);

  return (
    <ShopClient
      initialProducts={listingsResponse.data}
      pagination={listingsResponse.meta}
      categories={categoriesResponse.data}
      locale={locale}
      initialSearch={search}
      initialCategory={category}
      initialSort={sort}
      initialOrder={order}
    />
  );
}

