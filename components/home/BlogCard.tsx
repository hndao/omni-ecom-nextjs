"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { BlogPost } from "@/lib/blog";
import { formatBlogDate } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.article
        whileHover={{ scale: 1.02 }}
        className="group cursor-pointer"
      >
        <div className="aspect-[16/10] overflow-hidden rounded-xl mb-4 bg-gray-100 relative">
          {post.featured_image ? (
            <Image
              src={post.featured_image.url}
              alt={post.featured_image.alt || post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 bg-charcoal/5 flex items-center justify-center">
              <span className="font-serif text-3xl text-charcoal/10">Blog</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 mb-2">
          {post.category && (
            <span className="tracked-tiny text-primary font-bold">
              {post.category.name}
            </span>
          )}
          <span className="text-charcoal/40 text-xs">
            {formatBlogDate(post.published_at)}
          </span>
        </div>
        <h3 className="font-serif text-xl mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-charcoal/60 font-light text-sm leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      </motion.article>
    </Link>
  );
}
