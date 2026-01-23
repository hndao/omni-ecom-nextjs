'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  inventory: {
    available: number;
  };
}

export default function ProductCard({ product }: { product: Product }) {
  const t = useTranslations('products');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      {product.image && (
        <div className="relative h-64 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>
          {product.inventory.available > 0 ? (
            <span className="text-green-600 font-medium">
              {t('inStock')}
            </span>
          ) : (
            <span className="text-red-600 font-medium">
              {t('outOfStock')}
            </span>
          )}
        </div>
        <button
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          disabled={product.inventory.available === 0}
        >
          {t('addToCart')}
        </button>
      </div>
    </motion.div>
  );
}
