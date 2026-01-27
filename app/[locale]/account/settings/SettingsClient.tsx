'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { User, Lock, Mail, Trash2, Loader2 } from 'lucide-react';
import { getProfile, updateProfile, changePassword } from '@/types/auth';
import type { Customer } from '@/types';

export default function SettingsClient() {
  const t = useTranslations('settings');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences'>('profile');

  // Profile form state
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileSaving, setProfileSaving] = useState(false);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const profile = await getProfile();
      setCustomer(profile);
      setProfileData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone || '',
      });
    } catch (error: any) {
      if (error.message?.includes('Unauthenticated')) {
        router.push('/account/login');
      } else {
        alert(error.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileErrors({});
    setProfileSaving(true);

    try {
      const updated = await updateProfile(profileData);
      setCustomer(updated);
      alert(t('profileUpdated'));
    } catch (error: any) {
      if (error.errors) {
        setProfileErrors(error.errors);
      } else {
        alert(error.message || 'Failed to update profile');
      }
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordErrors({});

    // Validate password
    if (passwordData.password !== passwordData.password_confirmation) {
      setPasswordErrors({ password_confirmation: t('passwordMismatch') });
      return;
    }

    if (passwordData.password.length < 8) {
      setPasswordErrors({ password: t('passwordTooShort') });
      return;
    }

    setPasswordSaving(true);

    try {
      await changePassword(passwordData);
      alert(t('passwordChanged'));
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    } catch (error: any) {
      if (error.errors) {
        setPasswordErrors(error.errors);
      } else {
        alert(error.message || 'Failed to change password');
      }
    } finally {
      setPasswordSaving(false);
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="w-5 h-5 inline-block mr-2" />
            {t('profileTab')}
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Lock className="w-5 h-5 inline-block mr-2" />
            {t('passwordTab')}
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">{t('profileSettings')}</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('firstName')}
                </label>
                <input
                  type="text"
                  id="first_name"
                  value={profileData.first_name}
                  onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {profileErrors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{profileErrors.first_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('lastName')}
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={profileData.last_name}
                  onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {profileErrors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{profileErrors.last_name}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                id="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {profileErrors.email && (
                <p className="mt-1 text-sm text-red-600">{profileErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('phone')}
              </label>
              <input
                type="tel"
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {profileErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{profileErrors.phone}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={profileSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {profileSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t('saveChanges')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">{t('changePassword')}</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('currentPassword')}
              </label>
              <input
                type="password"
                id="current_password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {passwordErrors.current_password && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('newPassword')}
              </label>
              <input
                type="password"
                id="password"
                value={passwordData.password}
                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {passwordErrors.password && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.password}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">{t('passwordRequirements')}</p>
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                {t('confirmPassword')}
              </label>
              <input
                type="password"
                id="password_confirmation"
                value={passwordData.password_confirmation}
                onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {passwordErrors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.password_confirmation}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={passwordSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {passwordSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t('changePassword')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

