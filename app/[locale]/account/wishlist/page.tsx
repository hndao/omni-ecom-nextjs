import { getTranslations } from 'next-intl/server';
import WishlistClient from './WishlistClient';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'wishlist' });
  
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <WishlistClient />
    </div>
  );
}

