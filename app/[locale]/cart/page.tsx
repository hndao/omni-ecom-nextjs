import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import CartClient from './CartClient';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'cart' });
  
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CartClient />
    </div>
  );
}

