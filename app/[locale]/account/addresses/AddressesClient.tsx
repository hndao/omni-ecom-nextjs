'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MapPin, Plus, Edit, Trash2, Loader2, Star } from 'lucide-react';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  validateAddress,
  formatAddress,
  type AddressFormData,
} from '@/lib/addresses';
import type { CustomerAddress } from '@/types';

export default function AddressesClient() {
  const t = useTranslations('addresses');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    type: 'shipping',
    first_name: '',
    last_name: '',
    company: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    phone: '',
    is_default: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (error: any) {
      if (error.message?.includes('Unauthenticated')) {
        router.push('/account/login');
      } else {
        alert(error.message || 'Failed to load addresses');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleAddNew() {
    setEditingAddress(null);
    setFormData({
      type: 'shipping',
      first_name: '',
      last_name: '',
      company: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
      phone: '',
      is_default: false,
    });
    setFormErrors({});
    setShowForm(true);
  }

  function handleEdit(address: CustomerAddress) {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      first_name: address.first_name,
      last_name: address.last_name,
      company: address.company || '',
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone,
      is_default: address.is_default,
    });
    setFormErrors({});
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const errors = validateAddress(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
      } else {
        await createAddress(formData);
      }
      await loadAddresses();
      setShowForm(false);
    } catch (error: any) {
      if (error.errors) {
        setFormErrors(error.errors);
      } else {
        alert(error.message || 'Failed to save address');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(t('confirmDelete'))) return;

    setDeletingId(id);
    try {
      await deleteAddress(id);
      await loadAddresses();
    } catch (error: any) {
      alert(error.message || 'Failed to delete address');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetDefault(id: number) {
    try {
      await setDefaultAddress(id);
      await loadAddresses();
    } catch (error: any) {
      alert(error.message || 'Failed to set default address');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('addAddress')}
        </button>
      </div>

      {/* Address Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingAddress ? t('editAddress') : t('addAddress')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addressType')}
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="shipping"
                        checked={formData.type === 'shipping'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'shipping' })}
                        className="mr-2"
                      />
                      {t('shipping')}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="billing"
                        checked={formData.type === 'billing'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'billing' })}
                        className="mr-2"
                      />
                      {t('billing')}
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('firstName')} *
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formErrors.first_name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('lastName')} *
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formErrors.last_name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.last_name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('company')}
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="address_line_1" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addressLine1')} *
                  </label>
                  <input
                    type="text"
                    id="address_line_1"
                    value={formData.address_line_1}
                    onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formErrors.address_line_1 && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.address_line_1}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="address_line_2" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addressLine2')}
                  </label>
                  <input
                    type="text"
                    id="address_line_2"
                    value={formData.address_line_2}
                    onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('city')} *
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formErrors.city && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('state')} *
                    </label>
                    <input
                      type="text"
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formErrors.state && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('postalCode')} *
                    </label>
                    <input
                      type="text"
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formErrors.postal_code && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.postal_code}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('country')} *
                    </label>
                    <input
                      type="text"
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value.toUpperCase() })}
                      maxLength={2}
                      placeholder="US"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formErrors.country && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.country}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">{t('countryCodeHint')}</p>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('phone')} *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_default}
                      onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                      className="mr-2"
                    />
                    {t('setAsDefault')}
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingAddress ? t('updateAddress') : t('addAddress')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('noAddresses')}</h2>
          <p className="text-gray-500 mb-6">{t('noAddressesDescription')}</p>
          <button
            onClick={handleAddNew}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('addFirstAddress')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-lg shadow p-6 relative hover:shadow-lg transition-shadow"
            >
              {address.is_default && (
                <div className="absolute top-4 right-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
              )}

              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {address.type === 'shipping' ? t('shipping') : t('billing')}
                </span>
              </div>

              <div className="mb-4">
                <p className="font-semibold text-gray-900">
                  {address.first_name} {address.last_name}
                </p>
                {address.company && <p className="text-gray-600">{address.company}</p>}
                <p className="text-gray-600 whitespace-pre-line mt-2">{formatAddress(address)}</p>
                <p className="text-gray-600 mt-2">{address.phone}</p>
              </div>

              <div className="flex space-x-2">
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    {t('setDefault')}
                  </button>
                )}
                <button
                  onClick={() => handleEdit(address)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  {t('edit')}
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  disabled={deletingId === address.id}
                  className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === address.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

