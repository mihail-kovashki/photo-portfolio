"use client";

import { ArrowUp, Camera } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full py-12 border-t border-white/5 bg-[#09090b] text-zinc-500 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left note */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#d93829]" />
          </div>
          <span>© {new Date().getFullYear()} Mihail Kovashki. All photographs original.</span>
        </div>

        {/* Center Camera Specs */}
        <div className="hidden md:flex items-center gap-2 text-zinc-600">
          <span>FUJIFILM X-T5</span>
          <span>·</span>
          <span>Fujinon Optics</span>
          <span>·</span>
          <span>Lightroom Classic</span>
        </div>

        {/* Right scroll to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
        >
          <span>Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
