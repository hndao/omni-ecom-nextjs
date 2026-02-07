import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoriesShowcase from "@/components/home/CategoriesShowcase";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import EthicalSourcing from "@/components/home/EthicalSourcing";
import BlogPreview from "@/components/home/BlogPreview";
import NewsletterSection from "@/components/home/NewsletterSection";
import { getHomePageData } from "@/lib/home";
import { getFeaturedListings, getCategories } from "@/lib/products";
import { getTestimonials } from "@/lib/testimonials";
import { getBlogPosts } from "@/lib/blog";
import type { HeroContent, Product, Category, Testimonial } from "@/types";
import type { BlogPost } from "@/lib/blog";

// Default hero content used as fallback when API is unavailable
const DEFAULT_HERO: HeroContent = {
  title: "Ethereal Earth Gems",
  subtitle: "Discover Rare Gemstones",
  description:
    "Discover a curated world of rare, ethically sourced gemstones crafted into timeless masterpieces.",
  cta_text: "Discover Collection",
  cta_link: "/shop",
};

export default async function Home() {
  // Fetch all data in parallel with error handling
  const [homeData, featuredProducts, categoriesData, testimonials, blogData] =
    await Promise.allSettled([
      getHomePageData(),
      getFeaturedListings(6),
      getCategories({ show_on_website: true, per_page: 6 }),
      getTestimonials(4),
      getBlogPosts({ per_page: 3 }),
    ]);

  // Extract data with fallbacks
  const hero: HeroContent =
    homeData.status === "fulfilled" ? homeData.value.hero : DEFAULT_HERO;

  const sectionTitle =
    homeData.status === "fulfilled"
      ? homeData.value.featured_section_title
      : "Rare Acquisitions";
  const sectionSubtitle =
    homeData.status === "fulfilled"
      ? homeData.value.featured_section_subtitle
      : "Curation No. 1";

  const products: Product[] =
    featuredProducts.status === "fulfilled" ? featuredProducts.value : [];

  const categories: Category[] =
    categoriesData.status === "fulfilled" ? categoriesData.value.data : [];

  const reviews: Testimonial[] =
    testimonials.status === "fulfilled" ? testimonials.value : [];

  const blogPosts: BlogPost[] =
    blogData.status === "fulfilled" ? blogData.value.data : [];

  return (
    <>
      <Header />
      <main className="flex-grow max-w-[1440px] mx-auto px-6 md:px-20 w-full">
        <HeroSection heroData={hero} />

        <TrustBar />

        <FeaturedProducts
          products={products}
          sectionTitle={sectionTitle}
          sectionSubtitle={sectionSubtitle}
        />

        <CategoriesShowcase categories={categories} />

        <TestimonialsSection testimonials={reviews} />

        <EthicalSourcing />

        <BlogPreview posts={blogPosts} />

        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
