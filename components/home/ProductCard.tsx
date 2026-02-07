"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  aspectRatio?: string;
}

export default function ProductCard({
  product,
  aspectRatio = "aspect-[3/4]",
}: ProductCardProps) {
  const imageUrl =
    product.images?.[0]?.storage_url ||
    product.images?.[0]?.url ||
    product.featured_image?.storage_url ||
    product.featured_image?.url ||
    "";

  const displayPrice = product.sale_price
    ? formatPrice(parseFloat(product.sale_price))
    : formatPrice(parseFloat(product.price));

  return (
    <Link href={`/shop/${product.slug}`}>
      <motion.div whileHover={{ scale: 1.02 }} className="group cursor-pointer">
        <div
          className={`${aspectRatio} overflow-hidden rounded-xl mb-6 bg-gray-100 relative`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title || product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-charcoal/30">
              <span className="tracked-tiny">No Image</span>
            </div>
          )}
          {product.sale_price && (
            <div className="absolute top-3 right-3 bg-primary text-charcoal px-3 py-1 rounded-full">
              <span className="tracked-tiny font-bold">Sale</span>
            </div>
          )}
        </div>
        <p className="tracked-tiny font-bold mb-1">
          {product.title || product.name}
        </p>
        <p className="text-primary font-display text-sm">{displayPrice}</p>
      </motion.div>
    </Link>
  );
}
