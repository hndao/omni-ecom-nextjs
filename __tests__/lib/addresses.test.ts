/**
 * @jest-environment jsdom
 */

import { validateAddress, formatAddress, getAddressTypeLabel, type AddressFormData } from '@/lib/addresses';
import type { CustomerAddress } from '@/types';

describe('Address Utilities', () => {
  describe('validateAddress', () => {
    it('should return no errors for valid address', () => {
      const validAddress: AddressFormData = {
        type: 'shipping',
        first_name: 'John',
        last_name: 'Doe',
        address_line_1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US',
        phone: '+1234567890',
      };

      const errors = validateAddress(validAddress);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('should return error for missing first name', () => {
      const invalidAddress: Partial<AddressFormData> = {
        last_name: 'Doe',
        address_line_1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US',
        phone: '+1234567890',
      };

      const errors = validateAddress(invalidAddress);
      expect(errors.first_name).toBe('First name is required');
    });

    it('should return error for missing last name', () => {
      const invalidAddress: Partial<AddressFormData> = {
        first_name: 'John',
        address_line_1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US',
        phone: '+1234567890',
      };

      const errors = validateAddress(invalidAddress);
      expect(errors.last_name).toBe('Last name is required');
    });

    it('should return error for missing address', () => {
      const invalidAddress: Partial<AddressFormData> = {
        first_name: 'John',
        last_name: 'Doe',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US',
        phone: '+1234567890',
      };

      const errors = validateAddress(invalidAddress);
      expect(errors.address_line_1).toBe('Address is required');
    });

    it('should return error for invalid country code', () => {
      const invalidAddress: Partial<AddressFormData> = {
        first_name: 'John',
        last_name: 'Doe',
        address_line_1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'USA',
        phone: '+1234567890',
      };

      const errors = validateAddress(invalidAddress);
      expect(errors.country).toBe('Country must be a 2-letter code');
    });

    it('should return multiple errors for multiple missing fields', () => {
      const invalidAddress: Partial<AddressFormData> = {
        first_name: 'John',
      };

      const errors = validateAddress(invalidAddress);
      expect(Object.keys(errors).length).toBeGreaterThan(1);
      expect(errors.last_name).toBeDefined();
      expect(errors.address_line_1).toBeDefined();
      expect(errors.city).toBeDefined();
    });
  });

  describe('formatAddress', () => {
    it('should format address correctly', () => {
      const address: CustomerAddress = {
        id: 1,
        customer_id: 1,
        type: 'shipping',
        first_name: 'John',
        last_name: 'Doe',
        company: null,
        address_line_1: '123 Main St',
        address_line_2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US',
        phone: '+1234567890',
        is_default: false,
        created_at: '2026-01-27T00:00:00Z',
        updated_at: '2026-01-27T00:00:00Z',
      };

      const formatted = formatAddress(address);
      expect(formatted).toContain('123 Main St');
      expect(formatted).toContain('Apt 4B');
      expect(formatted).toContain('New York, NY 10001');
      expect(formatted).toContain('US');
    });

    it('should format address without address_line_2', () => {
      const address: CustomerAddress = {
        id: 1,
        customer_id: 1,
        type: 'shipping',
        first_name: 'John',
        last_name: 'Doe',
        company: null,
        address_line_1: '123 Main St',
        address_line_2: null,
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US',
        phone: '+1234567890',
        is_default: false,
        created_at: '2026-01-27T00:00:00Z',
        updated_at: '2026-01-27T00:00:00Z',
      };

      const formatted = formatAddress(address);
      expect(formatted).toContain('123 Main St');
      expect(formatted).not.toContain('null');
    });
  });

  describe('getAddressTypeLabel', () => {
    it('should return "Billing" for billing type', () => {
      expect(getAddressTypeLabel('billing')).toBe('Billing');
    });

    it('should return "Shipping" for shipping type', () => {
      expect(getAddressTypeLabel('shipping')).toBe('Shipping');
    });
  });
});

