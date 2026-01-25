import type { MetadataRoute } from 'next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'DYaOTulPEj2vJE8EDOzHEHqpHQXNC6mQ';
const CHANNEL_DOMAIN = process.env.NEXT_PUBLIC_CHANNEL_DOMAIN || 'localhost';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';

const locales = ['en'];

interface Product {
  id: number;
  slug?: string;
  updated_at: string;
}

interface PaginatedResponse {
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

async function fetchAllListings(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/listings?per_page=1000`, {
      headers: {
        'X-API-Key': API_KEY,
        'X-Channel-Domain': CHANNEL_DOMAIN,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('Failed to fetch listings for sitemap:', response.status);
      return [];
    }

    const data: PaginatedResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching listings for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await fetchAllListings();

  // Static pages for each locale
  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/${locale}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]);

  // Dynamic product pages for each locale
  const productPages: MetadataRoute.Sitemap = listings.flatMap((listing) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/shop/${listing.slug || listing.id}`,
      lastModified: new Date(listing.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  return [...staticPages, ...productPages];
}
