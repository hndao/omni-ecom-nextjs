"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-primary fill-primary" : "text-charcoal/20"
          }`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, [testimonials.length]);

  // Auto-play carousel
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, testimonials.length]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <span className="tracked-tiny text-primary mb-2 block">
          Testimonials
        </span>
        <h2 className="font-serif text-4xl">What Our Clients Say</h2>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-charcoal/5"
          >
            <Quote className="w-8 h-8 text-primary/30 mb-4" />
            <p className="text-charcoal/70 font-light leading-relaxed mb-6 line-clamp-4">
              {testimonial.review_text}
            </p>
            <div className="mt-auto">
              <StarRating rating={testimonial.rating} />
              <p className="tracked-tiny font-bold mt-3">
                {testimonial.customer_name}
              </p>
              <p className="text-charcoal/40 text-xs mt-1">
                {new Date(testimonial.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile: Carousel */}
      <div className="md:hidden relative">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-8 shadow-sm border border-charcoal/5"
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-charcoal/70 font-light leading-relaxed mb-6">
                {testimonials[activeIndex].review_text}
              </p>
              <StarRating rating={testimonials[activeIndex].rating} />
              <p className="tracked-tiny font-bold mt-3">
                {testimonials[activeIndex].customer_name}
              </p>
              <p className="text-charcoal/40 text-xs mt-1">
                {new Date(
                  testimonials[activeIndex].created_at
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {testimonials.length > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-charcoal/10 hover:border-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === activeIndex ? "bg-primary" : "bg-charcoal/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-full border border-charcoal/10 hover:border-primary transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
