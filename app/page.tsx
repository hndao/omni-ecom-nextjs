"use client";

import { motion } from "framer-motion";
import { Verified, Sparkles, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-[1440px] mx-auto px-6 md:px-20">
        {/* Hero Section */}
        <section className="min-h-[85vh] flex flex-col md:flex-row items-center gap-12 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col gap-8 order-2 md:order-1"
          >
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-charcoal dark:text-white">
              Ethereal <br /> Earth <span className="italic font-normal">Gems</span>
            </h1>
            <p className="max-w-md text-charcoal/70 dark:text-gray-400 text-lg font-light leading-relaxed">
              Discover a curated world of rare, ethically sourced gemstones crafted into timeless masterpieces.
            </p>
            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-bold rounded-full border border-charcoal dark:border-white hover:border-primary transition-all duration-300"
              >
                <span className="relative text-sm tracking-widest uppercase group-hover:text-primary">
                  Discover Collection
                </span>
              </motion.button>
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX6Yr2tU3ovmnMmrxkdr23Kkel1B5BqR--_PTyKn0XqFeGsyti6I2CkKTi8er2vtxBMq6HzH3F5JIY995HFLbikJcKdHMvb0TUxCchWc1uEpFbYBjQ5WOXfVl9nOXPFkqqBFvpkU-4e1ns7Z25WRFJaq_DN7uXFCYsJW9BqyE-sesCEdp7I1U5qci_xm1o71KqWyR73r9DITaJJcovyZBQ7Gs2SJUburnz5GCE8_x-5R74bMldZav1d9ymD4735Z-6cj4A5vtq244"
                alt="Macro close up of a rare blue gemstone crystal structure"
                fill
                className="object-cover scale-105 hover:scale-100 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>
        </section>

        {/* Trust Bar */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-y border-charcoal/10 dark:border-white/10 py-10 my-10"
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

        {/* Rare Acquisitions Section */}
        <section className="py-20">
          <div className="flex justify-between items-end mb-16 px-4">
            <div>
              <span className="tracked-tiny text-primary mb-2 block">Curation No. 1</span>
              <h2 className="font-serif text-4xl">Rare Acquisitions</h2>
            </div>
            <a href="#" className="vogue-underline tracked-tiny font-bold">
              View All Archive
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {/* Column 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-16"
            >
              <ProductCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuDJm0ZDh531kCv-EvgEwixHADEuCW2jrrCjb-eq4SphJeMCKNa8_X1DhyRHIQfnobw-0NTF8JsxA8XYHVbTnRwqrYz2xucOV5uxF3DCKiaf82S871c09yQ-sgdoNF4VttN75dGLBSD2LXHgFv5nUpoAIO_aX7k6IMVhC5OZ_ohpqo7R1NnGreUu3ugKhJ4YoJ_ABWMzxsICfeJOS_hoe3HHGYoSlh0KdnW7Dwj6htm1ML8OxIu7Jdy361rkN-wE4XXBu4C4pEIWvT8"
                title="Rare Padparadscha Sapphire"
                price="$12,400"
                aspectRatio="aspect-[3/4]"
              />
            </motion.div>

            {/* Column 2 (Offset) */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-16 pt-0 md:pt-24"
            >
              <ProductCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCp67MY0Z4Y0czg5qt0CgHBAeRVzEg1QQqR-iUq-MYlsfDZdg7N29DfQnwOazaVINznJmnR7W3y7CqMVliEzcTf5ICXfYQF3UXZOrvPa-9fWMajh8lK-mkn8P9Pfb-6XGsNOh7HRYn_or7UWeugSc-j1vkVT-u9RNZkU0fJGSi-tu3WGuK5eic9rYx9C5kITgGr29wX8qmqo05QDqc0aYrOLa369Ow6oCqiL_YGCrUJkaVU-bD61blLXi7rmq9C_jRXS2aM40mWJ-g"
                title="Colombian Emerald"
                price="$8,900"
                aspectRatio="aspect-square"
              />
              <ProductCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuAnbT56gPtL3OcrJGvXyS0waMDTAM3f0SKoA8gKEyKZ0QpVJ3v6ATHXPqatAFG_RpL7ON-1CV1H15uIFlpKwXR3DCirRqp_g3IaJj9pXxQtf6qCrqPTWk-bbtiRbzevpq05xftkLOPALw3uqteyOgmSiMlIphRMvXDYApWnDDZMthY2-ElkYT-Jiv1sEvGrfnnYqHojzmerGzHRbxaDtCYMyex2HmvI-gm0_g8rvOMqYB8CFCpAD7pH06GoGkMpSyqDW19GGyhP9JU"
                title="Rough Tanzanite Cluster"
                price="$4,200"
                aspectRatio="aspect-[4/5]"
              />
            </motion.div>

            {/* Column 3 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-16"
            >
              <ProductCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuC9KBtoaSZTL_C2JcdpIZjEWzu7d5DkSGHQPodx1DO_Abyt9vwbRgDuHZrZ2bctqfUrdJO84hx2BZCavJ_ovSEgh36UMd8PE9soHGs3nirDtrNdwUhxYRWkLZDFZekfs5oCT_pOy3mAYO3d5G5buY-LH_WhRKABwk7ODuXKKcKs-Sf9D4OhRKOBOsSOEDvp-d3mi1QgK9DMQFY-vkwD9pRWFG1BDELtGCdmO_LW8W-ed-NLomRN_dbEMJousQyAWGmzivnb9V0Iqyc"
                title="Royal Blue Tanzanite"
                price="$15,200"
                aspectRatio="aspect-[2/3]"
              />
            </motion.div>
          </div>
        </section>

        {/* Ethical Sourcing Section */}
        <section className="py-20 flex flex-col md:flex-row items-center gap-0">
          <div className="w-full md:w-[60%] relative h-[600px] overflow-hidden rounded-l-xl">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYwVxtUCmpcKdB_7RXhjj4yoQFHuccBgjMyfDupr7BzFVCF7mku2a6Gg8ShyWV-1Ne3LIFN7T0rSXIv6yv8Fr7ml-lsxfVv4AIgREFUcyKdNHZRRQWYircROGHbSB3ViPBTNCUkiOGfnoDZl8Rcg5lMaTOutqEnckK6ZrzNllnut2jKB_uIEp_ZRdyCCFdWs76U8fot0pHaSr7jn6ebVvXyRW3veV_5kXJ5U6NRie9A2AJ_A0MIO_n4bCTlEIYfCVtnyvVW1TRoEU"
              alt="Macro texture of raw geological stone layers"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="w-full md:w-[40%] bg-charcoal dark:bg-background-dark p-12 md:p-20 text-white flex flex-col justify-center rounded-r-xl -ml-0 md:-ml-10 z-10 relative">
            <span className="tracked-tiny text-primary mb-6">Transparency</span>
            <h2 className="font-serif text-5xl mb-8 leading-tight">One-of-a-Kind Ethical Origins</h2>
            <p className="text-gray-400 font-light leading-relaxed mb-10">
              Our commitment to ethical sourcing ensures every stone is as pure as its origin. We partner directly with
              artisanal mines to ensure transparency and GIA certification for every gemstone in our vault.
            </p>
            <div className="flex items-center gap-4 text-primary">
              <span className="h-[1px] w-12 bg-primary"></span>
              <a href="#" className="tracked-tiny font-bold hover:tracking-[0.3em] transition-all">
                Read Our Charter
              </a>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-32 text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-5xl mb-4">Join the Circle</h2>
          <p className="text-charcoal/60 dark:text-gray-400 font-light mb-12">
            Receive exclusive access to rare mineral drops and the 'Ethereal' newsletter.
          </p>
          <form className="flex flex-col md:flex-row gap-4">
            <input
              className="flex-1 bg-transparent border-b border-charcoal/20 dark:border-white/20 px-4 py-4 focus:outline-none focus:border-primary dark:focus:border-primary text-charcoal dark:text-white transition-colors"
              placeholder="Your Email Address"
              type="email"
            />
            <button
              className="bg-primary text-charcoal px-10 py-4 rounded-full font-bold tracking-widest uppercase hover:bg-primary/80 transition-all"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Product Card Component
function ProductCard({
  image,
  title,
  price,
  aspectRatio,
}: {
  image: string;
  title: string;
  price: string;
  aspectRatio: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="group cursor-pointer">
      <div className={`${aspectRatio} overflow-hidden rounded-xl mb-6 bg-gray-100 dark:bg-gray-800 relative`}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>
      <p className="tracked-tiny font-bold mb-1">{title}</p>
      <p className="text-primary font-display text-sm">{price}</p>
    </motion.div>
  );
}
