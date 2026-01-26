'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { CheckCircle, Package, Printer, ShoppingBag, Truck, MapPin, CreditCard } from 'lucide-react';
import { getOrder } from '@/lib/orders';
import type { Order } from '@/types';

interface OrderConfirmationClientProps {
  orderNumber: string;
}

export default function OrderConfirmationClient({ orderNumber }: OrderConfirmationClientProps) {
  const t = useTranslations('orderConfirmation');
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrder();
  }, [orderNumber]);

  async function loadOrder() {
    try {
      const orderData = await getOrder(orderNumber);
      setOrder(orderData);
    } catch (err: any) {
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-16">
        <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('orderNotFound')}</h2>
        <p className="text-gray-600 mb-6">{error || t('orderNotFoundDescription')}</p>
        <button
          onClick={() => router.push('/shop')}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('thankYou')}</h1>
        <p className="text-lg text-gray-700 mb-4">{t('orderPlaced')}</p>
        <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-lg border border-green-300">
          <span className="text-gray-600">{t('orderNumber')}:</span>
          <span className="font-bold text-xl text-gray-900">{order.order_number}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8 print:hidden">
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <Printer className="h-5 w-5" />
          {t('printOrder')}
        </button>
        <button
          onClick={() => router.push('/shop')}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ShoppingBag className="h-5 w-5" />
          {t('continueShopping')}
        </button>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('orderDetails')}</h2>
        
        {/* Order Items */}
        <div className="space-y-4 mb-6">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                <p className="text-sm text-gray-600">{t('sku')}: {item.product_sku}</p>
                <p className="text-sm text-gray-600">{t('quantity')}: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${parseFloat(item.total).toFixed(2)}</p>
                <p className="text-sm text-gray-600">${parseFloat(item.price).toFixed(2)} {t('each')}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('subtotal')}</span>
            <span className="font-medium">${parseFloat(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('shipping')}</span>
            <span className="font-medium">${parseFloat(order.shipping).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('tax')}</span>
            <span className="font-medium">${parseFloat(order.tax).toFixed(2)}</span>
          </div>
          {parseFloat(order.discount) > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>{t('discount')}</span>
              <span className="font-medium">-${parseFloat(order.discount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
            <span>{t('total')}</span>
            <span>${parseFloat(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Addresses and Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping Address */}
        {order.shipping_address && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold">{t('shippingAddress')}</h3>
            </div>
            <div className="text-gray-700 space-y-1">
              <p className="font-medium">
                {order.shipping_address.first_name} {order.shipping_address.last_name}
              </p>
              <p>{order.shipping_address.address_line1}</p>
              {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
              </p>
              <p>{order.shipping_address.country}</p>
              {order.shipping_address.phone && <p>{t('phone')}: {order.shipping_address.phone}</p>}
            </div>
          </div>
        )}

        {/* Billing Address */}
        {order.billing_address && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold">{t('billingAddress')}</h3>
            </div>
            <div className="text-gray-700 space-y-1">
              <p className="font-medium">
                {order.billing_address.first_name} {order.billing_address.last_name}
              </p>
              <p>{order.billing_address.address_line1}</p>
              {order.billing_address.address_line2 && <p>{order.billing_address.address_line2}</p>}
              <p>
                {order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}
              </p>
              <p>{order.billing_address.country}</p>
              {order.billing_address.phone && <p>{t('phone')}: {order.billing_address.phone}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold">{t('paymentInformation')}</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">{t('paymentMethod')}</span>
            <span className="font-medium">{order.payment_method || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('paymentStatus')}</span>
            <span className={`font-medium ${
              order.payment_status === 'paid' ? 'text-green-600' :
              order.payment_status === 'failed' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
            </span>
          </div>
          {order.paid_at && (
            <div className="flex justify-between">
              <span className="text-gray-600">{t('paidAt')}</span>
              <span className="font-medium">{new Date(order.paid_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Order Status & Tracking */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">{t('orderStatus')}</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">{t('currentStatus')}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          {order.status === 'shipped' || order.status === 'delivered' ? (
            <div className="mt-4">
              <p className="text-sm text-gray-700 mb-2">{t('trackingInfo')}</p>
              <button
                onClick={() => router.push(`/track-order?order=${order.order_number}`)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t('trackOrder')}
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mt-2">{t('processingMessage')}</p>
          )}
        </div>
      </div>

      {/* Customer Notes */}
      {order.customer_notes && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold mb-2">{t('orderNotes')}</h3>
          <p className="text-gray-700">{order.customer_notes}</p>
        </div>
      )}
    </div>
  );
}

