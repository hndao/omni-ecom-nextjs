"use client";

import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { Link } from "@/i18n/routing";
import type { BlogPost } from "@/lib/blog";

interface BlogPreviewProps {
  posts: BlogPost[];
}

export default function BlogPreview({ posts }: BlogPreviewProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-20">
      <div className="flex justify-between items-end mb-16 px-4">
        <div>
          <span className="tracked-tiny text-primary mb-2 block">
            From the Journal
          </span>
          <h2 className="font-serif text-4xl">Latest Stories</h2>
        </div>
        <Link href="/blog" className="vogue-underline tracked-tiny font-bold">
          View All Posts
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-10"
      >
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </motion.div>
    </section>
  );
}
