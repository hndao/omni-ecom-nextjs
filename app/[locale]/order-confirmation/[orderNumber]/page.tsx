import { getTranslations } from 'next-intl/server';
import OrderConfirmationClient from './OrderConfirmationClient';

export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string; orderNumber: string } 
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'orderConfirmation' });
  
  return {
    title: `${t('pageTitle')} - ${params.orderNumber}`,
    description: t('pageDescription'),
  };
}

export default function OrderConfirmationPage({ 
  params 
}: { 
  params: { orderNumber: string } 
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <OrderConfirmationClient orderNumber={params.orderNumber} />
    </div>
  );
}

