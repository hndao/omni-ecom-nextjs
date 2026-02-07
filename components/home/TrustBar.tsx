"use client";

import { motion } from "framer-motion";
import { Verified, Sparkles, Star } from "lucide-react";

export default function TrustBar() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-y border-charcoal/10 py-10 my-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center gap-3"
        >
          <Verified className="text-primary w-8 h-8" />
          <span className="tracked-tiny font-bold">GIA Certified Vault</span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center gap-3"
        >
          <Sparkles className="text-primary w-8 h-8" />
          <span className="tracked-tiny font-bold">Hand-crafted Artistry</span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center gap-3"
        >
          <Star className="text-primary w-8 h-8" />
          <span className="tracked-tiny font-bold">Etsy Star Seller</span>
        </motion.div>
      </div>
    </motion.section>
  );
}
