'use client';

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement?.classList?.add("scrolled");
      } else {
        imageElement?.classList?.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-40 pb-20 px-4 text-center">
      <div className="container mx-auto">
        {/* Animated Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2 }}
          whileHover={{ scale: 1.05 }}
          className="inline-block mb-6 px-6 py-3 bg-gradient-to-br from-yellow-400 to-orange-500 text-black font-bold text-3xl tracking-wide rounded-2xl shadow-xl"
        >
          PaisaTrackr
        </motion.div>

        {/* Tagline */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-7xl font-bold mb-4 text-white"
        >
          Apka Paisa, Apka Hisab
        </motion.h1>

        {/* Subheading */}
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          An AI-powered financial app to track your ₹expenses, send monthly
          reports, and alert you when your budget crosses the line.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 bg-yellow-400 text-black hover:bg-yellow-300">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
