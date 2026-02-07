"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Link } from "@/i18n/routing";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
  sectionTitle: string;
  sectionSubtitle: string;
}

const ASPECT_RATIOS = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[2/3]",
  "aspect-[3/4]",
  "aspect-square",
];

export default function FeaturedProducts({
  products,
  sectionTitle,
  sectionSubtitle,
}: FeaturedProductsProps) {
  if (!products || products.length === 0) return null;

  // Split products into 3 columns for the staggered layout
  const col1 = products.filter((_, i) => i % 3 === 0);
  const col2 = products.filter((_, i) => i % 3 === 1);
  const col3 = products.filter((_, i) => i % 3 === 2);

  return (
    <section className="py-20">
      <div className="flex justify-between items-end mb-16 px-4">
        <div>
          <span className="tracked-tiny text-primary mb-2 block">
            {sectionSubtitle}
          </span>
          <h2 className="font-serif text-4xl">{sectionTitle}</h2>
        </div>
        <Link href="/shop" className="vogue-underline tracked-tiny font-bold">
          View All Archive
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Column 1 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-16"
        >
          {col1.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              aspectRatio={ASPECT_RATIOS[i * 3] || "aspect-[3/4]"}
            />
          ))}
        </motion.div>

        {/* Column 2 (Offset) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-16 pt-0 md:pt-24"
        >
          {col2.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              aspectRatio={ASPECT_RATIOS[i * 3 + 1] || "aspect-square"}
            />
          ))}
        </motion.div>

        {/* Column 3 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col gap-16"
        >
          {col3.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              aspectRatio={ASPECT_RATIOS[i * 3 + 2] || "aspect-[2/3]"}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
