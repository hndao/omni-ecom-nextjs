"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingBag, User, ChevronRight, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useRouter, usePathname } from "@/i18n/routing";
import type { Product, Category, PaginationMeta } from "@/types";
import { useLocale } from "next-intl";

interface ShopClientProps {
  initialProducts: Product[];
  pagination: PaginationMeta;
  categories: Category[];
  locale: string;
  initialSearch?: string;
  initialCategory?: string;
  initialSort?: string;
  initialOrder?: string;
}

// Helper function to check if a listing/product is in stock
function isInStock(item: Product): boolean {
  // If it's a listing with products (bundle or variant)
  if (item.products && item.products.length > 0) {
    if (item.mapping_type === 'bundle') {
      // For bundles: ALL products must have stock
      return item.products.every(p => p.inventory && p.inventory.available > 0);
    } else if (item.mapping_type === 'variant') {
      // For variants: ANY product must have stock
      return item.products.some(p => p.inventory && p.inventory.available > 0);
    }
  }

  // For regular products: check inventory
  return item.inventory ? item.inventory.available > 0 : false;
}

// Helper function to get available quantity for display
function getAvailableQuantity(item: Product): number {
  // If it's a listing with products
  if (item.products && item.products.length > 0) {
    if (item.mapping_type === 'bundle') {
      // For bundles: minimum available across all products
      const quantities = item.products
        .map(p => p.inventory?.available || 0)
        .filter(q => q > 0);
      return quantities.length > 0 ? Math.min(...quantities) : 0;
    } else if (item.mapping_type === 'variant') {
      // For variants: maximum available across all products
      return Math.max(...item.products.map(p => p.inventory?.available || 0));
    }
  }

  // For regular products
  return item.inventory?.available || 0;
}

export default function ShopClient({
  initialProducts,
  pagination,
  categories,
  locale,
  initialSearch = "",
  initialCategory = "",
  initialSort = "created_at",
  initialOrder = "desc",
}: ShopClientProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [sortOrder, setSortOrder] = useState(initialOrder);

  const { width, height } = useWindowSize();
  const router = useRouter();
  const pathname = usePathname();

  const handleBuyNow = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchQuery });
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    updateFilters({ category: categorySlug });
  };

  const handleSortChange = (newSort: string) => {
    const [sort, order] = newSort.split(":");
    setSortBy(sort);
    setSortOrder(order);
    updateFilters({ sort, order });
  };

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams();

    if (newParams.search !== undefined ? newParams.search : searchQuery) {
      params.set("search", newParams.search !== undefined ? newParams.search : searchQuery);
    }
    if (newParams.category !== undefined ? newParams.category : selectedCategory) {
      params.set("category", newParams.category !== undefined ? newParams.category : selectedCategory);
    }
    if (newParams.sort || sortBy) {
      params.set("sort", newParams.sort || sortBy);
    }
    if (newParams.order || sortOrder) {
      params.set("order", newParams.order || sortOrder);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const buildPaginationUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());

    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (sortBy) params.set("sort", sortBy);
    if (sortOrder) params.set("order", sortOrder);

    return `${pathname}?${params.toString()}`;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("created_at");
    setSortOrder("desc");
    router.push(pathname);
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
    }).format(numPrice);
  };

  const getProductImage = (product: Product) => {
    const coverImage = product.images?.find((img) => img.is_cover || img.pivot?.is_cover);
    // Use a simple gray placeholder SVG as data URI
    const placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
    return coverImage?.storage_url || product.images?.[0]?.storage_url || placeholder;
  };

  const getProductName = (product: Product) => {
    // For listings, use title instead of name
    if (product.title) {
      return product.title;
    }
    const translation = product.translations?.find((t) => t.locale === locale);
    return translation?.name || product.name || 'Untitled';
  };

  const getProductDescription = (product: Product) => {
    const translation = product.translations?.find((t) => t.locale === locale);
    return translation?.description || product.description;
  };

  const getCategoryName = (category: Category) => {
    const translation = category.translations?.find((t) => t.locale === locale);
    return translation?.name || category.name;
  };

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background-light/90 backdrop-blur-md border-b border-charcoal/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex h-20 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tighter uppercase">Luxe Gemstones</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-widest text-charcoal/70">
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
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <input
                className="bg-transparent border-none border-b border-charcoal/20 focus:border-primary focus:ring-0 text-sm py-1 px-0 w-48 placeholder:text-charcoal/40"
                placeholder="Search our archives..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-0 top-1">
                <Search className="text-charcoal/40 w-4 h-4" />
              </button>
            </form>
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
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/50 mb-6">
            <Link href="/" className="hover:text-charcoal transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-charcoal">Shop</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-light italic mb-6 leading-tight font-serif">
              The Rare Earth Collection
            </h1>
            <p className="text-xl text-charcoal/70 font-light leading-relaxed">
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
                  <button
                    onClick={clearFilters}
                    className="text-[10px] text-primary cursor-pointer hover:underline"
                  >
                    Reset
                  </button>
                </h3>

                {/* Category Filter */}
                <div className="space-y-4">
                  <details className="group" open>
                    <summary className="flex items-center justify-between cursor-pointer py-2 border-b border-charcoal/10 list-none">
                      <span className="text-sm font-medium">Categories</span>
                      <span className="text-sm group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="pt-4 space-y-2 px-1">
                      {categories.map((category) => (
                        <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            className="rounded-sm border-charcoal/20 text-primary focus:ring-primary/20"
                            type="radio"
                            name="category"
                            checked={selectedCategory === category.slug}
                            onChange={() => handleCategoryChange(category.slug)}
                          />
                          <span className="text-sm text-charcoal/70 group-hover:text-charcoal transition-colors">
                            {getCategoryName(category)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </details>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => updateFilters({})}
                  className="w-full bg-charcoal text-white py-4 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sorting */}
            <div className="flex flex-wrap items-center justify-between gap-6 mb-12 border-b border-charcoal/5 pb-8">
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center gap-2 bg-charcoal/5 px-4 py-2 rounded-full text-xs font-medium">
                    Search: {searchQuery}
                    <button onClick={() => { setSearchQuery(""); updateFilters({ search: "" }); }}>
                      <X className="w-4 h-4 cursor-pointer" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-2 bg-charcoal/5 px-4 py-2 rounded-full text-xs font-medium">
                    {getCategoryName(categories.find((c) => c.slug === selectedCategory)!)}
                    <button onClick={() => { setSelectedCategory(""); updateFilters({ category: "" }); }}>
                      <X className="w-4 h-4 cursor-pointer" />
                    </button>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs uppercase tracking-widest">
                <span className="text-charcoal/40">Sort by:</span>
                <select
                  className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest pr-8"
                  value={`${sortBy}:${sortOrder}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="price:desc">Price: High to Low</option>
                  <option value="price:asc">Price: Low to High</option>
                  <option value="created_at:desc">Newest Arrivals</option>
                  <option value="name:asc">Name: A to Z</option>
                  <option value="name:desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {initialProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-xl text-charcoal/50">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-16 items-start">
                {initialProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onBuyNow={handleBuyNow}
                    formatPrice={formatPrice}
                    getProductImage={getProductImage}
                    getProductName={getProductName}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="mt-32 text-center border-t border-charcoal/5 pt-16">
                <p className="text-[10px] uppercase tracking-widest text-charcoal/40 mb-8">
                  Showing {pagination.from} - {pagination.to} of {pagination.total} Products
                </p>
                <div className="w-48 h-[1px] bg-charcoal/10 mx-auto mb-12 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary"
                    style={{ width: `${(pagination.current_page / pagination.last_page) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-center gap-4">
                  {pagination.current_page > 1 && (
                    <Link
                      href={buildPaginationUrl(pagination.current_page - 1)}
                      className="px-12 py-5 border border-charcoal text-xs uppercase tracking-widest font-bold hover:bg-charcoal hover:text-white transition-all duration-300"
                    >
                      Previous
                    </Link>
                  )}
                  {pagination.current_page < pagination.last_page && (
                    <Link
                      href={buildPaginationUrl(pagination.current_page + 1)}
                      className="px-12 py-5 border border-charcoal text-xs uppercase tracking-widest font-bold hover:bg-charcoal hover:text-white transition-all duration-300"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background-light border-t border-charcoal/5 py-24 mt-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold uppercase mb-8 tracking-tighter text-charcoal">Luxe Gemstones</h2>
            <p className="text-sm font-light text-charcoal/60 leading-relaxed mb-8">
              Crafting legacies since 1924. We specialize in the acquisition of rare earth elements and bespoke jewelry
              design.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8 text-primary">Explore</h4>
            <ul className="space-y-4 text-sm font-light text-charcoal/60">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  The Archives
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Investment Grade
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-24 pt-8 border-t border-charcoal/5 flex flex-col md:flex-row justify-between text-[10px] uppercase tracking-widest text-charcoal/40">
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
  formatPrice,
  getProductImage,
  getProductName,
}: {
  product: Product;
  index: number;
  onBuyNow: () => void;
  formatPrice: (price: string) => string;
  getProductImage: (product: Product) => string;
  getProductName: (product: Product) => string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const productImage = getProductImage(product);
  const productName = getProductName(product);
  const secondaryImage = product.images?.[1]?.storage_url || productImage;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a button or link
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
      return;
    }
    // router from @/i18n/routing already handles locale prefixing
    router.push(`/shop/${product.id}`);
  };

  const inStock = isInStock(product);
  const availableQty = getAvailableQuantity(product);

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
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden mb-6 aspect-[4/5] bg-gray-100">
        {availableQty > 0 && availableQty < 5 && (
          <span className="absolute top-4 left-4 z-10 bg-primary text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-bold">
            Only {availableQty} Left
          </span>
        )}

        <Image
          src={productImage}
          alt={productName}
          fill
          className={`object-cover transition-opacity duration-700 ${isHovered ? "opacity-0" : "opacity-100"}`}
        />
        <Image
          src={secondaryImage}
          alt={productName}
          fill
          className={`object-cover transition-opacity duration-700 ${isHovered ? "opacity-100" : "opacity-0"}`}
        />

        <div
          className={`absolute inset-0 bg-charcoal/10 transition-opacity flex items-center justify-center ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {product.external_purchase_url ? (
            <motion.a
              href={product.external_purchase_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 20 }}
              animate={{ y: isHovered ? 0 : 20 }}
              className="inline-flex items-center gap-2 px-6 py-3 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: '#EB6D20', color: 'white' }}
            >
              Buy on Etsy
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          ) : (
            <motion.button
              initial={{ y: 20 }}
              animate={{ y: isHovered ? 0 : 20 }}
              onClick={onBuyNow}
              className="bg-white/90 px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-colors"
              disabled={!inStock}
            >
              {inStock ? "Buy Now" : "Out of Stock"}
            </motion.button>
          )}
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h3 className="text-xl font-light italic font-serif hover:text-primary transition-colors">
          {productName}
        </h3>
        <p className="text-[11px] uppercase tracking-widest-extra text-charcoal/50 font-bold">
          {formatPrice(product.price)}
        </p>
      </div>
    </motion.div>
  );
}

