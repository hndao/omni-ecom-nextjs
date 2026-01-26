/**
 * Checkout API functions
 */

import { post } from './api';

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface BillingAddress extends ShippingAddress {
  same_as_shipping?: boolean;
}

export interface PaymentMethod {
  method: 'credit_card' | 'paypal' | 'stripe';
  card_number?: string;
  card_holder_name?: string;
  expiry_month?: string;
  expiry_year?: string;
  cvv?: string;
  paypal_email?: string;
}

export interface CheckoutData {
  shipping_address: ShippingAddress;
  billing_address?: BillingAddress;
  payment_method: PaymentMethod;
  notes?: string;
}

export interface OrderResponse {
  id: number;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
}

/**
 * Create order from checkout data
 */
export async function createOrder(data: CheckoutData): Promise<OrderResponse> {
  const response = await post<{ data: OrderResponse }>('/orders', data);
  return response.data;
}

/**
 * Validate shipping address
 */
export function validateShippingAddress(address: Partial<ShippingAddress>): string[] {
  const errors: string[] = [];

  if (!address.first_name?.trim()) {
    errors.push('First name is required');
  }
  if (!address.last_name?.trim()) {
    errors.push('Last name is required');
  }
  if (!address.address_line1?.trim()) {
    errors.push('Address is required');
  }
  if (!address.city?.trim()) {
    errors.push('City is required');
  }
  if (!address.state?.trim()) {
    errors.push('State/Province is required');
  }
  if (!address.postal_code?.trim()) {
    errors.push('Postal code is required');
  }
  if (!address.country?.trim()) {
    errors.push('Country is required');
  }
  if (!address.phone?.trim()) {
    errors.push('Phone number is required');
  }

  return errors;
}

/**
 * Validate payment method
 */
export function validatePaymentMethod(payment: Partial<PaymentMethod>): string[] {
  const errors: string[] = [];

  if (!payment.method) {
    errors.push('Payment method is required');
  }

  if (payment.method === 'credit_card') {
    if (!payment.card_number?.trim()) {
      errors.push('Card number is required');
    } else if (!/^\d{13,19}$/.test(payment.card_number.replace(/\s/g, ''))) {
      errors.push('Invalid card number');
    }

    if (!payment.card_holder_name?.trim()) {
      errors.push('Card holder name is required');
    }

    if (!payment.expiry_month || !payment.expiry_year) {
      errors.push('Expiry date is required');
    }

    if (!payment.cvv?.trim()) {
      errors.push('CVV is required');
    } else if (!/^\d{3,4}$/.test(payment.cvv)) {
      errors.push('Invalid CVV');
    }
  }

  if (payment.method === 'paypal') {
    if (!payment.paypal_email?.trim()) {
      errors.push('PayPal email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payment.paypal_email)) {
      errors.push('Invalid email address');
    }
  }

  return errors;
}

/**
 * Format card number with spaces
 */
export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
}

/**
 * Mask card number for display
 */
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) return cardNumber;
  return '**** **** **** ' + cleaned.slice(-4);
}

