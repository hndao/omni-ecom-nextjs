/**
 * Customer Address API functions
 */

import { get, post, put, del } from './api';
import type { CustomerAddress } from '../types';

export interface AddressesResponse {
  data: CustomerAddress[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface AddressFormData {
  type: 'billing' | 'shipping';
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default?: boolean;
}

/**
 * Get all addresses for the authenticated customer
 */
export async function getAddresses(): Promise<CustomerAddress[]> {
  const response = await get<AddressesResponse>('/customer/addresses');
  return response.data;
}

/**
 * Get a specific address by ID
 */
export async function getAddress(id: number): Promise<CustomerAddress> {
  const response = await get<{ data: CustomerAddress }>(`/customer/addresses/${id}`);
  return response.data;
}

/**
 * Create a new address
 */
export async function createAddress(data: AddressFormData): Promise<CustomerAddress> {
  const response = await post<{ data: CustomerAddress }>('/customer/addresses', data);
  return response.data;
}

/**
 * Update an existing address
 */
export async function updateAddress(id: number, data: Partial<AddressFormData>): Promise<CustomerAddress> {
  const response = await put<{ data: CustomerAddress }>(`/customer/addresses/${id}`, data);
  return response.data;
}

/**
 * Delete an address
 */
export async function deleteAddress(id: number): Promise<void> {
  await del(`/customer/addresses/${id}`);
}

/**
 * Set an address as default
 */
export async function setDefaultAddress(id: number): Promise<CustomerAddress> {
  const response = await post<{ data: CustomerAddress }>(`/customer/addresses/${id}/set-default`);
  return response.data;
}

/**
 * Validate address form data
 */
export function validateAddress(data: Partial<AddressFormData>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.first_name?.trim()) {
    errors.first_name = 'First name is required';
  }

  if (!data.last_name?.trim()) {
    errors.last_name = 'Last name is required';
  }

  if (!data.address_line_1?.trim()) {
    errors.address_line_1 = 'Address is required';
  }

  if (!data.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!data.state?.trim()) {
    errors.state = 'State/Province is required';
  }

  if (!data.postal_code?.trim()) {
    errors.postal_code = 'Postal code is required';
  }

  if (!data.country?.trim()) {
    errors.country = 'Country is required';
  } else if (data.country.length !== 2) {
    errors.country = 'Country must be a 2-letter code';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  }

  return errors;
}

/**
 * Format address for display
 */
export function formatAddress(address: CustomerAddress): string {
  const lines = [
    address.address_line_1,
    address.address_line_2,
    `${address.city}, ${address.state} ${address.postal_code}`,
    address.country,
  ];

  return lines.filter(Boolean).join('\n');
}

/**
 * Get address type label
 */
export function getAddressTypeLabel(type: 'billing' | 'shipping'): string {
  return type === 'billing' ? 'Billing' : 'Shipping';
}

