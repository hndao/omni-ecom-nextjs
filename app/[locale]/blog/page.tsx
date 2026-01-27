import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import BlogListClient from './BlogListClient';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'blog' });

  return {
    title: t('title'),
    description: t('latestPosts'),
  };
}

export default function BlogPage() {
  return <BlogListClient />;
}

