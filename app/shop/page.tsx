"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingBag, User, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/useWindowSize";

const products = [
  {
    id: 1,
    name: "The Midnight Oval Sapphire",
    price: "$14,500.00",
    primaryImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1ezTjHsrmg2JJFRCwRzcvUyFLLgWEB0pr-onkreVLWCWGzCJ0B6y2_HpytaLZSUNscIh-0vfGoCgrq0RFa1R9IFa12ymU2vNAunlEVH2KnqcZLWtYFnrILKKB7MAO4fQcA6leGaoj-CsHf6jlOponJe4QArX42KhPaLfLd7vydOPI67UN6OeldDGQQ5EaQtt8DYMZSNZu2WgrZFVkKHHV0aZ8FSfGsYCzB0coaa05o4YKYkxb_oU8ppxmN3H4th1DWAlbakoCh74",
    secondaryImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGXn7dQT2Uyu6GWZx9EBSdXacHTqKPZRPYosR3cMybWA-59c9h3Xygcvg6c7ht2RZBz-Xc3okO8GQDz_uOHFeoZz0C20N7LiaMwNHv-E_GbvD-XJC2Hkcfx81qnJbaaLi9KZoz_9ezt573KEBdi91oIO0D60xlBzVfRXda4N-Mmx5dyDj807tBphdbcDZObsPjZd7eIeLb88qB6gElixa2WIWjX9OEy0N_OW3qOn9jBThaN2mnHyHsNIvqGzdJy7mNqs-c-FU0rcc",
    aspectRatio: "aspect-[4/5]",
    badge: "New Arrival",
  },
  {
    id: 2,
    name: "Verdant Cushion Emerald",
    price: "$22,800.00",
    primaryImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5STCNogI7TLeY_VihcTlErRSlZ9JyGiijX2uxWJ6lGKPlxx-c8yIS6b1-ILFDRnMlaO4zBePmN1bkxpzCeIadW9z99aqKNmeGxdOTaH2OHRYEJ_mOOimIDh31fZcPUfEeiU_3ahEAHTh8MvPYSMG_B0dZtt96Bx6bUzeOJSOhp96B1wwlRX8RJafZnZCcYeCz3PGLby5-gA5gjFPJIrk5TJWTdhOzSZtoKDKPSX1xDxLIRGsFwBRPyJ9TUItqqLk6NthDFoYzAWc",
    secondaryImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6b8XpCSIfKSv0DK99mOm7xOuhyg442PVnQywD2MwAHdniRy7SJ0eXMHD3legjxfsOBCKWfiZxm1r-VX_H_6h6y4fKcOQra0bVrjo0CCUcdde_dOktimbrFXlVYiC3C37XBO1_u96gxhKkqhNpxjBikruT6zr1QcCPOHqSNCTEMNyYnMnfCiXn8HS5eApXIKnIBGfvu0lixz-wBRDWs3xzW6dXLj2SwAvzastJPKARgq6M_3_JKdxmwwH8oe7eLjKvYS9rb8If3Hk",
    aspectRatio: "aspect-[3/4]",
  },
  {
    id: 3,
    name: "Pigeon Blood Round Ruby",
    price: "$31,200.00",
    primaryImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBXDudSoh2Q8mlr3resdHU4VIsXlVgXz9gxa33NW9xQdGuxrAO8fnQkVrwiEI-e9SRHlUTugtCjidtRyVS5UTMo9y2uXTdiEK6R6EZCZFPXIHGFFBw5MWIbgT-a2-04VbOJpyWCEo_7AnJNZExZWWly8b9Cf4cAqrr2FtUoXV0PVB4bTpVAo87F6E5binl2hwcGf9MK9oqCYAeZiAhA7BnOgS9umZ2y-nYnYlTvEiy56l-x4bL1fZYXmGiXxHfEuapJLucnuPbomI",
    secondaryImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOsjJhx3Nw_efr9NLC-wg8CzPFxgUHouLTqMOD8I6rGMi3oBA2fFGBeVP5pFLtULbt1OmqwbGJ5DwrIkP0SYbdrEWUgA-p8xLnYkO-6HwP4LpOXpBhCWxwyh6OD0jvqVpRRt_x48st23k__kTyCUPDqyQEs8y8smBiyGl362RD41Cf8I3t5hTr8JnsjKmz01da24OzdxzaaXRRORJqSuaa9a2zukdRyd3wP0JidJHKvrDqh52hUbD4pmRtUDT01yN7Mp8pcPPQfQY",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: 4,
    name: "Golden Pear Diamond",
    price: "$45,000.00",
    primaryImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuClnxKY1nKQhKPqxTmUUIMzTGHsgcYH6okqeP8_CMX0U_215HiR8t_mIsx7lb3nUnYoH8lUUl4rYJQhrPSZbuj6CbiHu7VgLTuisJ6kuX4euokrhIf2zFnq_-1phkFjlh00ctbTeMn_DXMT_9q7Wn7F435ubmjPdbe_D9YrGjNXHe0cQGsfWIErFa5z0Z8semCJeobRpM90Ioly1VrVj8VzeqcIpYUXq5KNV6cE7SzeJlCXDyJZNYYdv6CeyCj_-ZjGbEtHwy0QN_Q",
    secondaryImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCu2V2SdgGQhs94rO0D7LJsTRl4s3Egme1aclt5oLewgbHMOdMFzZmRrK5yQAL5LUAve9l-I2utu2caipC7N6VEWiarhDjbVCgjfOMzNjPUWZtCiqHYtxHFbZFXi8aTFoq3yiNE-dR0VXUEwfL9iLN8cCwjoqvWk13zCzj6nIiFl_qyfWrOVCATdHnczAl1dv1BtRItzBef1fDmz1da-9JFYPSclV088YMWdYOni_aFHWROMQRAVIDhsWfY28e9Q9QzzhbSKr39oMw",
    aspectRatio: "aspect-square",
  },
  {
    id: 5,
    name: "Lagoon Paraiba Tourmaline",
    price: "$18,900.00",
    primaryImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBNRCRdP89YPUZ7k9HJDcCvnpo-FQE33e12X5ATp36terQc_wdozNe8V4nbrqnhd0yIBgGxhZdw9OHtlwPDBdMbjmlz9-b9W1ZDlsx_I1RQgRO-oAJTFuopqTMVsGxU6mxaW_RR63kRa9LAFXEVmsp6PhoU_iOJHmiI7z1OvZ9GYFUGEFZSw95NCq0maH-BObv_FLzVHAbLEeV2W6-b-57f9_S37vMc_8FzA_xgGLIf6DFFXfQLtwtHm3wELGUH54Prk9LoFvu8Z3E",
    secondaryImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9jHQga2lISkjQqQRqC5CkiLyw0N-Yrp-BVqQPLToFoyvW3uzWkSKHj56QYqGw3sxTIPkQfCydiyI047brtu_TuAn4mnCeZxVMLSJoSdWzDn1DiNOdVttxeyf-JR9rYp4Y4-vbNYa2IN41G6MK0lFR6xMhAxGgXF6U52Bl8Ukv97Dhrbr1oK4bGDzRtFAkJkMzr6ozc1t4WuxjG-TC2y6KgWmx_jTHhB81_08KF_Y3fYs0Xe8Bzc20T9RlbuoKXVelG8rNhASDWUo",
    aspectRatio: "aspect-[3/4]",
  },
  {
    id: 6,
    name: "Imperial Ural Alexandrite",
    price: "$38,000.00",
    primaryImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA8KpsP5rFWNKF9CM4n6XiLan6MEVU_KhxsGpgKjX5XKbR2HAnTLdPYu0PZdmDfCehSlrlp-eUhptoMGMC32fhkIHOqawLHYksCENmDA-VgZyjEF3ky6y66ZDpuSyUxTSqlMf01C43E2eeqMpkB_QeUCVW_HcOhxxpE4bfoXOmdMxyLLAjeRZ4z3mab6VINtWjY4tWE8588M2wiKXEfu8ozyG_3cg-LFL4GvVfyF2Wnciho_Zle1FbpimgVydZPo3W9jNborUzM7cE",
    secondaryImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrcsHvwPqzIzgG2zuEa7sfJmf0sbLQkppreg_Sl2rgtVi7BHHBv3iw73fyRJaR-LZmSLrTP9LoCqW3ddp8cohVcKiCkv5cbuJTUecXeIHxow5vmVelG1-tEnmN3TWvXTmQ9Xr3Zb8jNKYu1_5qIUs1uMDO1uvCzTBzT6r2UP5F3DP6zF-iY2nIhWP4OViEbSewgdontkMONywMvSwQ05drZs0gxSorI_957WDW4LDpeJOMfhIuPIzKzsd_HOUknfjIORg7X_BOIjw",
    aspectRatio: "aspect-[4/5]",
  },
];

export default function ShopPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const handleBuyNow = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-charcoal/5 dark:border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex h-20 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tighter uppercase">Luxe Gemstones</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-widest text-charcoal/70 dark:text-gray-400">
              <Link href="/shop" className="hover:text-primary transition-colors">
                Collections
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Bespoke
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Heritage
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Journal
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <input
                className="bg-transparent border-none border-b border-charcoal/20 focus:border-primary focus:ring-0 text-sm py-1 px-0 w-48 placeholder:text-charcoal/40 dark:placeholder:text-gray-500"
                placeholder="Search our archives..."
                type="text"
              />
              <Search className="absolute right-0 top-1 text-charcoal/40 w-4 h-4" />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-charcoal/5 rounded-full transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-charcoal/5 rounded-full transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        {/* Breadcrumbs & Heading */}
        <div className="mb-16">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/50 dark:text-gray-500 mb-6">
            <Link href="/" className="hover:text-charcoal transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-charcoal dark:text-gray-200">Rare Earth Collection</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-light italic mb-6 leading-tight font-serif">
              The Rare Earth Collection
            </h1>
            <p className="text-xl text-charcoal/70 dark:text-gray-400 font-light leading-relaxed">
              A curated assembly of earth's most exceptional treasures. Each stone is ethically sourced, hand-selected
              for its singular fire and unparalleled provenance.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-32 space-y-10">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold mb-6 flex items-center justify-between">
                  Filters
                  <span className="text-[10px] text-primary cursor-pointer hover:underline">Reset</span>
                </h3>

                {/* Filter Categories */}
                <div className="space-y-4">
                  <details className="group" open>
                    <summary className="flex items-center justify-between cursor-pointer py-2 border-b border-charcoal/10 dark:border-white/10 list-none">
                      <span className="text-sm font-medium">Gemstone Type</span>
                      <span className="text-sm group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="pt-4 space-y-2 px-1">
                      {["Ceylon Sapphire", "Zambian Emerald", "Burmese Ruby", "Russian Alexandrite"].map((type) => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            className="rounded-sm border-charcoal/20 text-primary focus:ring-primary/20"
                            type="checkbox"
                          />
                          <span className="text-sm text-charcoal/70 dark:text-gray-400 group-hover:text-charcoal transition-colors">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </details>

                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer py-2 border-b border-charcoal/10 dark:border-white/10 list-none">
                      <span className="text-sm font-medium">Color Palette</span>
                      <span className="text-sm group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="pt-4 grid grid-cols-4 gap-2">
                      {["#002366", "#004b49", "#8b0000", "#ffdb58"].map((color) => (
                        <div
                          key={color}
                          className="aspect-square rounded-full border border-charcoal/10 cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </details>
                </div>
              </div>

              <div className="pt-8">
                <button className="w-full bg-charcoal dark:bg-primary text-white dark:text-charcoal py-4 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity">
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sorting & Chips */}
            <div className="flex flex-wrap items-center justify-between gap-6 mb-12 border-b border-charcoal/5 pb-8">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 bg-charcoal/5 dark:bg-white/5 px-4 py-2 rounded-full text-xs font-medium">
                  Sapphire
                  <X className="w-4 h-4 cursor-pointer" />
                </span>
                <span className="inline-flex items-center gap-2 bg-charcoal/5 dark:bg-white/5 px-4 py-2 rounded-full text-xs font-medium">
                  Over 5.0 ct
                  <X className="w-4 h-4 cursor-pointer" />
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs uppercase tracking-widest">
                <span className="text-charcoal/40">Sort by:</span>
                <select className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest pr-8">
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                  <option>Carat Weight</option>
                </select>
              </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-16 items-start">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} onBuyNow={handleBuyNow} />
              ))}
            </div>

            {/* Load More */}
            <div className="mt-32 text-center border-t border-charcoal/5 pt-16">
              <p className="text-[10px] uppercase tracking-widest text-charcoal/40 mb-8">
                Showing 6 of 42 Exquisite Stones
              </p>
              <div className="w-48 h-[1px] bg-charcoal/10 mx-auto mb-12 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1/3 bg-primary"></div>
              </div>
              <button className="px-12 py-5 border border-charcoal text-xs uppercase tracking-widest font-bold hover:bg-charcoal hover:text-white transition-all duration-300">
                View Full Collection
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-charcoal text-[#fbfbf9] py-24 mt-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold uppercase mb-8 tracking-tighter">Luxe Gemstones</h2>
            <p className="text-sm font-light text-gray-400 leading-relaxed mb-8">
              Crafting legacies since 1924. We specialize in the acquisition of rare earth elements and bespoke jewelry
              design.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8 text-primary">Explore</h4>
            <ul className="space-y-4 text-sm font-light text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  The Archives
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Investment Grade
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-[10px] uppercase tracking-widest text-gray-600">
          <p>© 2024 Luxe Gemstones International. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}

// Product Card Component
function ProductCard({
  product,
  index,
  onBuyNow,
}: {
  product: (typeof products)[0];
  index: number;
  onBuyNow: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="product-card group cursor-pointer"
      style={{ marginTop: index % 2 === 1 ? "2rem" : index % 3 === 2 ? "4rem" : "0" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden mb-6 ${product.aspectRatio} bg-gray-100`}>
        {product.badge && (
          <span className="absolute top-4 left-4 z-10 bg-primary text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-bold">
            {product.badge}
          </span>
        )}

        <Image
          src={product.primaryImage}
          alt={product.name}
          fill
          className={`object-cover transition-opacity duration-700 ${isHovered ? "opacity-0" : "opacity-100"}`}
        />
        <Image
          src={product.secondaryImage}
          alt={product.name}
          fill
          className={`object-cover transition-opacity duration-700 ${isHovered ? "opacity-100" : "opacity-0"}`}
        />

        <div
          className={`absolute inset-0 bg-charcoal/10 transition-opacity flex items-center justify-center ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <motion.button
            initial={{ y: 20 }}
            animate={{ y: isHovered ? 0 : 20 }}
            onClick={onBuyNow}
            className="bg-white/90 px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-colors"
          >
            Buy Now
          </motion.button>
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h3 className="text-xl font-light italic font-serif">{product.name}</h3>
        <p className="text-[11px] uppercase tracking-widest-extra text-charcoal/50 font-bold">{product.price}</p>
      </div>
    </motion.div>
  );
}

