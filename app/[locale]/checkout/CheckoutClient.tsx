'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { getCart, type CartSummary } from '@/lib/cart';
import { createOrder, validateShippingAddress, validatePaymentMethod, type ShippingAddress, type PaymentMethod } from '@/lib/checkout';

type CheckoutStep = 'shipping' | 'payment' | 'review';

export default function CheckoutClient() {
  const t = useTranslations('checkout');
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [loading, setLoading] = useState(false);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Form data
  const [shippingAddress, setShippingAddress] = useState<Partial<ShippingAddress>>({
    country: 'US',
  });
  const [billingAddress, setBillingAddress] = useState<Partial<ShippingAddress>>({});
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<Partial<PaymentMethod>>({
    method: 'credit_card',
  });
  const [orderNotes, setOrderNotes] = useState('');

  useEffect(() => {
    loadCartSummary();
  }, []);

  async function loadCartSummary() {
    try {
      const cart = await getCart();
      setCartSummary(cart.summary);
      
      if (cart.items.length === 0) {
        router.push('/cart');
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }

  function handleShippingNext() {
    const validationErrors = validateShippingAddress(shippingAddress);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    setCurrentStep('payment');
  }

  function handlePaymentNext() {
    const validationErrors = validatePaymentMethod(paymentMethod);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    setCurrentStep('review');
  }

  async function handlePlaceOrder() {
    setLoading(true);
    setErrors([]);

    try {
      const orderData = {
        shipping_address: shippingAddress as ShippingAddress,
        billing_address: sameAsShipping ? undefined : billingAddress as ShippingAddress,
        payment_method: paymentMethod as PaymentMethod,
        notes: orderNotes,
      };

      const order = await createOrder(orderData);
      router.push(`/order-confirmation/${order.order_number}`);
    } catch (error: any) {
      setErrors([error.message || 'Failed to place order']);
    } finally {
      setLoading(false);
    }
  }

  const steps = [
    { id: 'shipping', label: t('steps.shipping'), completed: currentStep !== 'shipping' },
    { id: 'payment', label: t('steps.payment'), completed: currentStep === 'review' },
    { id: 'review', label: t('steps.review'), completed: false },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-green-600 text-white'
                      : currentStep === step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.completed ? <Check className="h-5 w-5" /> : index + 1}
                </div>
                <span className="ml-3 font-medium">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${step.completed ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <ul className="list-disc list-inside text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Shipping Step */}
          {currentStep === 'shipping' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">{t('shippingAddress')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('firstName')}
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.first_name || ''}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('lastName')}
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.last_name || ''}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('address')}
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address_line1 || ''}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address_line1: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('addressLine2')}
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address_line2 || ''}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address_line2: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('city')}
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city || ''}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('state')}
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.state || ''}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('postalCode')}
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.postal_code || ''}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('country')}
                  </label>
                  <select
                    value={shippingAddress.country || 'US'}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="FR">France</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone || ''}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleShippingNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  {t('continue')}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === 'payment' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">{t('paymentMethod')}</h2>

              <div className="space-y-4 mb-6">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment_method"
                    value="credit_card"
                    checked={paymentMethod.method === 'credit_card'}
                    onChange={(e) => setPaymentMethod({ ...paymentMethod, method: e.target.value as any })}
                    className="mr-3"
                  />
                  <span className="font-medium">{t('creditCard')}</span>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment_method"
                    value="paypal"
                    checked={paymentMethod.method === 'paypal'}
                    onChange={(e) => setPaymentMethod({ ...paymentMethod, method: e.target.value as any })}
                    className="mr-3"
                  />
                  <span className="font-medium">{t('paypal')}</span>
                </label>
              </div>

              {paymentMethod.method === 'credit_card' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('cardNumber')}
                    </label>
                    <input
                      type="text"
                      value={paymentMethod.card_number || ''}
                      onChange={(e) => setPaymentMethod({ ...paymentMethod, card_number: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('cardHolderName')}
                    </label>
                    <input
                      type="text"
                      value={paymentMethod.card_holder_name || ''}
                      onChange={(e) => setPaymentMethod({ ...paymentMethod, card_holder_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('expiryDate')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={paymentMethod.expiry_month || ''}
                        onChange={(e) => setPaymentMethod({ ...paymentMethod, expiry_month: e.target.value })}
                        placeholder="MM"
                        maxLength={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={paymentMethod.expiry_year || ''}
                        onChange={(e) => setPaymentMethod({ ...paymentMethod, expiry_year: e.target.value })}
                        placeholder="YYYY"
                        maxLength={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('cvv')}
                    </label>
                    <input
                      type="text"
                      value={paymentMethod.cvv || ''}
                      onChange={(e) => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {paymentMethod.method === 'paypal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('paypalEmail')}
                  </label>
                  <input
                    type="email"
                    value={paymentMethod.paypal_email || ''}
                    onChange={(e) => setPaymentMethod({ ...paymentMethod, paypal_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setCurrentStep('shipping')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  {t('back')}
                </button>
                <button
                  onClick={handlePaymentNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  {t('continue')}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              {/* Shipping Address Review */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{t('shippingAddress')}</h3>
                  <button
                    onClick={() => setCurrentStep('shipping')}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    {t('edit')}
                  </button>
                </div>
                <div className="text-gray-700">
                  <p>{shippingAddress.first_name} {shippingAddress.last_name}</p>
                  <p>{shippingAddress.address_line1}</p>
                  {shippingAddress.address_line2 && <p>{shippingAddress.address_line2}</p>}
                  <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}</p>
                  <p>{shippingAddress.country}</p>
                  <p>{shippingAddress.phone}</p>
                </div>
              </div>

              {/* Payment Method Review */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{t('paymentMethod')}</h3>
                  <button
                    onClick={() => setCurrentStep('payment')}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    {t('edit')}
                  </button>
                </div>
                <div className="text-gray-700">
                  {paymentMethod.method === 'credit_card' && (
                    <p>{t('creditCard')} ending in {paymentMethod.card_number?.slice(-4)}</p>
                  )}
                  {paymentMethod.method === 'paypal' && (
                    <p>{t('paypal')}: {paymentMethod.paypal_email}</p>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">{t('orderNotes')}</h3>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={t('orderNotesPlaceholder')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('payment')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  {t('back')}
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? t('processing') : t('placeOrder')}
                  {!loading && <Check className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">{t('orderSummary')}</h3>
            {cartSummary && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('subtotal')}</span>
                  <span className="font-medium">${cartSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('shipping')}</span>
                  <span className="font-medium">${cartSummary.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('tax')}</span>
                  <span className="font-medium">${cartSummary.tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">{t('total')}</span>
                  <span className="font-bold text-lg">${cartSummary.total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

