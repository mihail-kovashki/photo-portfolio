"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="pt-20 sm:pt-28 pb-3 sm:pb-6 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center"
      >
        {/* Editorial Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight text-white max-w-4xl leading-[1.1] mb-4 sm:mb-5">
          <span className="block">Visual Notes from</span>
          <span className="block">
            <span className="italic font-normal text-[#f4f4f5]/80">Travels</span> &{" "}
            <span className="italic font-normal text-[#f4f4f5]/80">Cities</span>
          </span>
        </h1>

        {/* Narrative Description (Option B: Monospace tag + clean Sans body) */}
        <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2.5">
          Personal Photographic Journal
        </p>
        <p className="text-xs sm:text-sm text-zinc-300/90 max-w-xl font-sans font-light leading-relaxed mb-0">
          Using travels as an excuse to wander with a camera—mostly exploring street scenes, landscapes, and quiet moments in between.
        </p>
      </motion.div>
    </section>
  );
}
