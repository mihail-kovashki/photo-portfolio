"use client";

import { motion } from "framer-motion";
import { Camera, Compass, Aperture, Eye } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center"
      >
        {/* Subtle camera metadata badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d93829]" />
          <span>FUJIFILM X-T5</span>
          <span className="text-zinc-600">·</span>
          <span>XF 23mm F1.4 R LM WR</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-300">40.2 MP X-TRANS</span>
        </div>

        {/* Editorial Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Visual Notes from <span className="italic font-normal text-[#f4f4f5]/80">Northern Snow</span> & <span className="italic font-normal text-[#f4f4f5]/80">Neon Nights</span>
        </h1>

        {/* Narrative Description */}
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-sans font-light leading-relaxed mb-8">
          A personal photographic journal captured across Hokkaido and Korea. Shot entirely on a single 35mm-equivalent prime lens, exploring light, silence, and film simulation recipes.
        </p>

        {/* Camera Spec Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl pt-2">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Body</span>
            <span className="text-xs sm:text-sm font-mono font-medium text-zinc-200">Fujifilm X-T5</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Glass</span>
            <span className="text-xs sm:text-sm font-mono font-medium text-zinc-200">XF 23mm F1.4 LM</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Perspective</span>
            <span className="text-xs sm:text-sm font-mono font-medium text-zinc-200">35mm Field of View</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Color Craft</span>
            <span className="text-xs sm:text-sm font-mono font-medium text-zinc-200">Film Simulations</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
