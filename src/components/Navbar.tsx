"use client";

import { useState, useEffect } from "react";
import { Camera, Instagram } from "lucide-react";

interface SeriesItem {
  id: string;
  name: string;
  count: number;
}

interface NavbarProps {
  onOpenGear: () => void;
  activeSeries: string;
  onSelectSeries: (seriesId: string) => void;
  seriesList?: SeriesItem[];
}

export function Navbar({ onOpenGear, activeSeries, onSelectSeries, seriesList = [] }: NavbarProps) {
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
            <span className="w-2.5 h-2.5 rounded-full bg-[#d93829] shadow-[0_0_8px_#d93829]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-wider uppercase text-zinc-100 font-mono">
                Mihail Kovashki
              </span>
              <span className="text-[10px] font-mono text-zinc-500 font-normal">
                / miko
              </span>
            </div>
            <span className="text-[11px] tracking-widest text-zinc-400 font-mono flex items-center gap-1.5">
              <span>FUJIFILM X-T5</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">Fujinon Glass</span>
            </span>
          </div>
        </div>

        {/* Dynamic Series Quick Filter on Desktop (up to 4 items) */}
        {seriesList.length > 0 && (
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 text-xs font-mono">
            {seriesList.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectSeries(item.id)}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  activeSeries === item.id
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        )}

        {/* Action Cluster: Instagram & Gear */}
        <div className="flex items-center gap-2">
          {/* Subtle Instagram link */}
          <a
            href="https://www.instagram.com/mi_ko.jpg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @mi_ko.jpg"
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all duration-200 group"
          >
            <Instagram className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#e1306c] transition-colors" />
            <span className="hidden sm:inline">@mi_ko.jpg</span>
          </a>

          {/* Camera & Setup */}
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
