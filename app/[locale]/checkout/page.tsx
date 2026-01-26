import { getTranslations } from 'next-intl/server';
import CheckoutClient from './CheckoutClient';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'checkout' });
  
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <CheckoutClient />
    </div>
  );
}

