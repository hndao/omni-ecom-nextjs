import { getTranslations } from 'next-intl/server';
import TrackOrderClient from './TrackOrderClient';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'orderTracking' });
  
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default function TrackOrderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <TrackOrderClient />
    </div>
  );
}

