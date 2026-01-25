"use client";

import { Search, ShoppingBag, User } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full bg-background-light/80 backdrop-blur-md border-b border-charcoal/5 px-6 md:px-20 py-4"
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Left Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/shop" className="vogue-underline text-xs font-semibold tracking-widest uppercase">
            Shop
          </Link>
          <Link href="/story" className="vogue-underline text-xs font-semibold tracking-widest uppercase">
            Our Story
          </Link>
          <Link href="/education" className="vogue-underline text-xs font-semibold tracking-widest uppercase">
            Education
          </Link>
        </nav>

        {/* Centered Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="text-primary">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 48 48">
              <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" />
            </svg>
          </div>
          <h1 className="font-serif italic text-2xl font-bold tracking-tight">ETHEREAL</h1>
        </Link>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          <button className="hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="hover:text-primary transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </button>
          <button className="hover:text-primary transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}

