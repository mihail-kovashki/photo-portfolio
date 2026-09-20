"use client";

import { useState, useEffect } from "react";
import { Camera, Sliders, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onOpenGear: () => void;
  activeSeries: string;
  onSelectSeries: (seriesId: string) => void;
}

export function Navbar({ onOpenGear, activeSeries, onSelectSeries }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#09090b]/80 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand & Photographer Signature */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/15">
            {/* Fuji classic red accent dot */}
            <span className="w-2.5 h-2.5 rounded-full bg-[#d93829] shadow-[0_0_8px_#d93829]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wider uppercase text-zinc-100 font-mono">
              Mihail Kovashki
            </span>
            <span className="text-[11px] tracking-widest text-zinc-400 font-mono flex items-center gap-1.5">
              <span>FUJIFILM X-T5</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400">23mm F1.4</span>
            </span>
          </div>
        </div>

        {/* Series Quick Filter on Desktop */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 text-xs font-mono">
          <button
            onClick={() => onSelectSeries("all")}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              activeSeries === "all"
                ? "bg-white text-zinc-950 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            All Works
          </button>
          <button
            onClick={() => onSelectSeries("hokkaido")}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              activeSeries === "hokkaido"
                ? "bg-white text-zinc-950 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Hokkaido 2025
          </button>
          <button
            onClick={() => onSelectSeries("korea")}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              activeSeries === "korea"
                ? "bg-white text-zinc-950 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Korea 2025
          </button>
        </nav>

        {/* Gear & Craft Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGear}
            className="flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-[#e59866]" />
            <span className="hidden sm:inline">Camera & Setup</span>
            <span className="sm:hidden">Gear</span>
          </button>
        </div>
      </div>
    </header>
  );
}
