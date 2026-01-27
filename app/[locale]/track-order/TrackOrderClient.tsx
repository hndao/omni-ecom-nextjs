'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Package, CheckCircle, Clock, Truck, XCircle, ExternalLink } from 'lucide-react';
import { trackOrder, getOrderTimeline, getCarrierTrackingUrl, validateEmail, validateOrderNumber } from '@/lib/order-tracking';
import type { Order } from '@/types';

export default function TrackOrderClient() {
  const t = useTranslations('orderTracking');
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTrackOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validation
    if (!validateOrderNumber(orderNumber)) {
      setError(t('invalidOrderNumber'));
      return;
    }

    if (!validateEmail(email)) {
      setError(t('invalidEmail'));
      return;
    }

    setLoading(true);

    try {
      const orderData = await trackOrder({ order_number: orderNumber, email });
      setOrder(orderData);
    } catch (err: any) {
      setError(err.message || t('orderNotFound'));
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'shipped':
        return <Truck className="h-8 w-8 text-blue-600" />;
      case 'processing':
        return <Clock className="h-8 w-8 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-8 w-8 text-red-600" />;
      default:
        return <Package className="h-8 w-8 text-gray-600" />;
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Search className="h-6 w-6 text-gray-600" />
          <h2 className="text-2xl font-bold">{t('title')}</h2>
        </div>
        
        <form onSubmit={handleTrackOrder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('orderNumber')}
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder={t('orderNumberPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {t('searching')}
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                {t('trackOrder')}
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          {t('helpText')}
        </p>
      </div>

      {/* Order Results */}
      {order && (
        <div className="space-y-6">
          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{t('orderDetails')}</h3>
                <p className="text-gray-600">{t('orderNumber')}: {order.order_number}</p>
              </div>
              <div className="text-right">
                {getStatusIcon(order.status)}
                <p className="text-sm font-medium text-gray-700 mt-1">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">{t('orderDate')}</p>
                <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('total')}</p>
                <p className="font-medium">${parseFloat(order.total).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('paymentStatus')}</p>
                <p className={`font-medium ${
                  order.payment_status === 'paid' ? 'text-green-600' :
                  order.payment_status === 'failed' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">{t('items')}</p>
                <p className="font-medium">{order.items?.length || 0} {t('itemsCount')}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-6">{t('trackingTimeline')}</h3>

            <div className="relative">
              {getOrderTimeline(order).map((step, index, array) => (
                <div key={step.status} className="flex gap-4 pb-8 last:pb-0">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed
                        ? step.current
                          ? 'bg-blue-600 text-white'
                          : 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {step.completed ? (
                        step.current ? (
                          <Clock className="h-5 w-5" />
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      )}
                    </div>
                    {index < array.length - 1 && (
                      <div className={`w-0.5 h-full mt-2 ${
                        step.completed ? 'bg-green-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>

                  {/* Timeline Content */}
                  <div className="flex-1 pb-4">
                    <h4 className={`font-semibold ${
                      step.completed ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </h4>
                    {step.date && (
                      <p className="text-sm text-gray-600">
                        {new Date(step.date).toLocaleString()}
                      </p>
                    )}
                    {step.current && (
                      <p className="text-sm text-blue-600 mt-1">{t('currentStatus')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">{t('shippingAddress')}</h3>
              <div className="text-gray-700 space-y-1">
                <p className="font-medium">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                </p>
                <p>{order.shipping_address.address_line_1}</p>
                {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
                {order.shipping_address.phone && <p>{t('phone')}: {order.shipping_address.phone}</p>}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">{t('orderItems')}</h3>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                    <p className="text-sm text-gray-600">{t('sku')}: {item.product_sku}</p>
                    <p className="text-sm text-gray-600">{t('quantity')}: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${parseFloat(item.total).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

