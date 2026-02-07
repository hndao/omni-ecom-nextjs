"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/shop?category=${category.slug}`}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="group relative overflow-hidden rounded-xl cursor-pointer"
      >
        <div className="aspect-[4/3] relative bg-gray-100">
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 bg-charcoal/5 flex items-center justify-center">
              <span className="font-serif text-2xl text-charcoal/20">
                {category.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-white font-serif text-xl mb-1">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-white/70 text-xs tracking-wider uppercase">
              {category.description}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
