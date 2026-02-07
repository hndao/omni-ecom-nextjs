"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { HeroContent } from "@/types";

interface HeroSectionProps {
  heroData: HeroContent;
}

export default function HeroSection({ heroData }: HeroSectionProps) {
  return (
    <section className="min-h-[85vh] flex flex-col md:flex-row items-center gap-12 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col gap-8 order-2 md:order-1"
      >
        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-charcoal">
          {heroData.title.split(" ").map((word, i, arr) => (
            <span key={i}>
              {i === arr.length - 1 ? (
                <span className="italic font-normal">{word}</span>
              ) : (
                word
              )}
              {i < arr.length - 1 && (i === 0 ? <br /> : " ")}
            </span>
          ))}
        </h1>
        {heroData.subtitle && (
          <p className="tracked-tiny text-primary">{heroData.subtitle}</p>
        )}
        <p className="max-w-md text-charcoal/70 text-lg font-light leading-relaxed">
          {heroData.description}
        </p>
        <div>
          <Link href={heroData.cta_link}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-bold rounded-full border border-charcoal hover:border-primary transition-all duration-300"
            >
              <span className="relative text-sm tracking-widest uppercase group-hover:text-primary">
                {heroData.cta_text}
              </span>
            </motion.button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 w-full order-1 md:order-2"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl shadow-2xl">
          <Image
            src={
              heroData.background_image?.storage_url ||
              heroData.background_image?.url ||
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBX6Yr2tU3ovmnMmrxkdr23Kkel1B5BqR--_PTyKn0XqFeGsyti6I2CkKTi8er2vtxBMq6HzH3F5JIY995HFLbikJcKdHMvb0TUxCchWc1uEpFbYBjQ5WOXfVl9nOXPFkqqBFvpkU-4e1ns7Z25WRFJaq_DN7uXFCYsJW9BqyE-sesCEdp7I1U5qci_xm1o71KqWyR73r9DITaJJcovyZBQ7Gs2SJUburnz5GCE8_x-5R74bMldZav1d9ymD4735Z-6cj4A5vtq244"
            }
            alt={heroData.background_image?.alt || "Rare gemstone crystal"}
            fill
            priority
            className="object-cover scale-105 hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </motion.div>
    </section>
  );
}
