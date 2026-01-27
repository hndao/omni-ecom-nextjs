"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, User, ChevronRight, ExternalLink, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/useWindowSize";
import type { Product, ListingDetails } from "@/types";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts?: Product[];
  locale: string;
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

export default function ProductDetailClient({ product, relatedProducts = [], locale }: ProductDetailClientProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { width, height } = useWindowSize();

  const handleBuyNow = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
    }).format(numPrice);
  };

  const getProductName = () => {
    // For listings, use title instead of name
    if (product.title) {
      return product.title;
    }
    const translation = product.translations?.find((t) => t.locale === locale);
    return translation?.name || product.name || 'Untitled';
  };

  const getProductDescription = () => {
    const translation = product.translations?.find((t) => t.locale === locale);
    return translation?.description || product.description;
  };

  const getCategoryName = (category: any) => {
    const translation = category.translations?.find((t: any) => t.locale === locale);
    return translation?.name || category.name;
  };

  const images = product.images || [];
  const coverImage = images.find((img) => img.is_cover || img.pivot?.is_cover) || images[0];
  const displayImages = images.length > 0 ? images : [{
    id: 0,
    storage_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Crect width='800' height='800' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='48' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E",
    is_cover: true
  }];

  const productInStock = isInStock(product);
  const maxQuantity = getAvailableQuantity(product);

  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
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
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/50 mb-12">
          <Link href="/" className="hover:text-charcoal transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-charcoal transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-charcoal">{getProductName()}</span>
        </nav>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-square relative bg-gray-100 overflow-hidden">
              <Image
                src={displayImages[selectedImage]?.storage_url || displayImages[0]?.storage_url || ''}
                alt={getProductName()}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {displayImages.map((image, index) => (
                  <button
                    key={image.id || index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative bg-gray-100 overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-charcoal/20"
                    }`}
                  >
                    <Image
                      src={image.storage_url || ''}
                      alt={`${getProductName()} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            {/* Product Name & Price */}
            <div>
              <h1 className="text-5xl md:text-6xl font-light italic mb-4 leading-tight font-serif">
                {getProductName()}
              </h1>
              <p className="text-3xl font-light text-charcoal">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop?category=${category.slug}`}
                    className="text-xs uppercase tracking-widest px-4 py-2 border border-charcoal/20 hover:border-primary hover:text-primary transition-colors"
                  >
                    {getCategoryName(category)}
                  </Link>
                ))}
              </div>
            )}

            {/* Description */}
            {getProductDescription() && (
              <div className="prose prose-lg max-w-none">
                <p className="text-charcoal/70 leading-relaxed">
                  {getProductDescription()}
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="border-t border-b border-charcoal/10 py-6">
              {productInStock ? (
                <p className="text-sm uppercase tracking-widest text-green-600">
                  In Stock ({maxQuantity} available)
                </p>
              ) : (
                <p className="text-sm uppercase tracking-widest text-red-600">
                  Out of Stock
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            {productInStock && !product.external_purchase_url && (
              <div className="flex items-center gap-6">
                <span className="text-sm uppercase tracking-widest font-medium">Quantity:</span>
                <div className="flex items-center border border-charcoal/20">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-charcoal/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 text-lg font-medium">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= maxQuantity}
                    className="p-3 hover:bg-charcoal/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {product.external_purchase_url ? (
                <motion.a
                  href={product.external_purchase_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 text-sm uppercase tracking-widest font-bold transition-all duration-300"
                  style={{ backgroundColor: '#EB6D20', color: 'white' }}
                >
                  Buy on Etsy
                  <ExternalLink className="w-5 h-5" />
                </motion.a>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleBuyNow}
                    disabled={!productInStock}
                    className="w-full bg-charcoal text-white px-8 py-5 text-sm uppercase tracking-widest font-bold hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {productInStock ? "Buy Now" : "Out of Stock"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    disabled={!productInStock}
                    className="w-full border-2 border-charcoal text-charcoal px-8 py-5 text-sm uppercase tracking-widest font-bold hover:bg-charcoal hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </motion.button>
                </>
              )}
            </div>

            {/* Product Meta */}
            <div className="border-t border-charcoal/10 pt-8 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal/50 uppercase tracking-widest">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              {product.metadata && Object.keys(product.metadata).length > 0 && (
                <>
                  {Object.entries(product.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-charcoal/50 uppercase tracking-widest">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Listing Details */}
            {product.listing_details && (
              <div className="border-t border-charcoal/10 pt-8 space-y-6">
                {/* Badge */}
                {product.listing_details.badge && (
                  <div className="inline-block px-4 py-2 bg-primary/10 text-primary text-xs uppercase tracking-widest font-medium">
                    {product.listing_details.badge}
                  </div>
                )}

                {/* Shipping Info */}
                {product.listing_details.shipping_info && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-widest font-medium text-charcoal/50">
                      Shipping
                    </h4>
                    <p className="text-sm text-charcoal/70 leading-relaxed">
                      {product.listing_details.shipping_info}
                    </p>
                  </div>
                )}

                {/* Return Policy */}
                {product.listing_details.return_policy && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-widest font-medium text-charcoal/50">
                      Returns
                    </h4>
                    <p className="text-sm text-charcoal/70 leading-relaxed">
                      {product.listing_details.return_policy}
                    </p>
                  </div>
                )}

                {/* Warranty Info */}
                {product.listing_details.warranty_info && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-widest font-medium text-charcoal/50">
                      Warranty
                    </h4>
                    <p className="text-sm text-charcoal/70 leading-relaxed">
                      {product.listing_details.warranty_info}
                    </p>
                  </div>
                )}

                {/* Custom Attributes */}
                {product.listing_details.custom_attributes &&
                  Object.keys(product.listing_details.custom_attributes).length > 0 && (
                  <div className="space-y-3">
                    {Object.entries(product.listing_details.custom_attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-charcoal/50 uppercase tracking-widest">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Processing Time (Etsy) */}
                {product.listing_details.processing_time && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-widest font-medium text-charcoal/50">
                      Processing Time
                    </h4>
                    <p className="text-sm text-charcoal/70">
                      {product.listing_details.processing_time}
                    </p>
                  </div>
                )}

                {/* Materials (Etsy) */}
                {product.listing_details.materials && product.listing_details.materials.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-widest font-medium text-charcoal/50">
                      Materials
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.listing_details.materials.map((material, index) => (
                        <span
                          key={index}
                          className="text-xs px-3 py-1 bg-charcoal/5 text-charcoal/70"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-light italic font-serif mb-4">You May Also Like</h2>
            <p className="text-sm uppercase tracking-widest text-charcoal/50">Curated selections based on this item</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => {
              const relatedImages = relatedProduct.images || [];
              const relatedCoverImage = relatedImages.find((img) => img.is_cover || img.pivot?.is_cover) || relatedImages[0];
              const relatedSecondImage = relatedImages[1] || relatedCoverImage;
              const relatedInStock = isInStock(relatedProduct);

              return (
                <Link
                  key={relatedProduct.id}
                  href={`/shop/${relatedProduct.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                    {/* Primary Image */}
                    {relatedCoverImage && (
                      <Image
                        src={relatedCoverImage.storage_url || ''}
                        alt={relatedProduct.title || relatedProduct.name || 'Product'}
                        fill
                        className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                    )}
                    {/* Secondary Image (on hover) */}
                    {relatedSecondImage && (
                      <Image
                        src={relatedSecondImage.storage_url || ''}
                        alt={relatedProduct.title || relatedProduct.name || 'Product'}
                        fill
                        className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    )}
                    {/* Out of Stock Badge */}
                    {!relatedInStock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-sm uppercase tracking-widest font-medium px-4 py-2 border border-white">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-light group-hover:text-primary transition-colors line-clamp-2">
                      {relatedProduct.title || relatedProduct.name}
                    </h3>
                    <p className="text-sm text-charcoal/60">
                      {formatPrice(relatedProduct.price)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

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


