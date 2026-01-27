import { Metadata } from 'next';
import SettingsClient from './SettingsClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Account Settings - Omni E-Commerce',
    description: 'Manage your account settings, profile, and preferences',
  };
}

export default function SettingsPage() {
  return <SettingsClient />;
}

