"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { ApiError } from "@/lib/api";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const result = await subscribeToNewsletter(email);
      setStatus("success");
      setMessage(result.message);
      setEmail("");
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError) {
        setMessage(err.message);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section className="py-32 text-center max-w-2xl mx-auto">
      <h2 className="font-serif text-5xl mb-4">Join the Circle</h2>
      <p className="text-charcoal/60 font-light mb-12">
        Receive exclusive access to rare mineral drops and the
        &lsquo;Ethereal&rsquo; newsletter.
      </p>

      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary font-medium"
        >
          {message}
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input
            className="flex-1 bg-transparent border-b border-charcoal/20 px-4 py-4 focus:outline-none focus:border-primary text-charcoal transition-colors"
            placeholder="Your Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
          />
          <button
            className="bg-primary text-charcoal px-10 py-4 rounded-full font-bold tracking-widest uppercase hover:bg-primary/80 transition-all disabled:opacity-50"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-sm mt-4"
        >
          {message}
        </motion.p>
      )}
    </section>
  );
}
