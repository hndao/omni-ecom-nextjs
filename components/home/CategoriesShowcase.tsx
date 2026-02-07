"use client";

import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";
import { Link } from "@/i18n/routing";
import type { Category } from "@/types";

interface CategoriesShowcaseProps {
  categories: Category[];
}

export default function CategoriesShowcase({
  categories,
}: CategoriesShowcaseProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-20">
      <div className="flex justify-between items-end mb-16 px-4">
        <div>
          <span className="tracked-tiny text-primary mb-2 block">
            Explore
          </span>
          <h2 className="font-serif text-4xl">Shop by Category</h2>
        </div>
        <Link href="/shop" className="vogue-underline tracked-tiny font-bold">
          View All Categories
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </motion.div>
    </section>
  );
}
