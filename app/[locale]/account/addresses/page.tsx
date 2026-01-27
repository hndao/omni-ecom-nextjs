import { Metadata } from 'next';
import AddressesClient from './AddressesClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Address Book - Omni E-Commerce',
    description: 'Manage your shipping and billing addresses',
  };
}

export default function AddressesPage() {
  return <AddressesClient />;
}

