"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Camera, Instagram, ChevronDown } from "lucide-react";
import { portfolioConfig } from "@/data/config";

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
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    if (isMoreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMoreOpen]);

  // Determine series distribution across breakpoints:
  // - item 0: featuredItems[0] (visible on md+)
  // - item 1: featuredItems[1] (visible on lg+, in dropdown on < lg)
  // - item 2: featuredItems[2] (visible on xl+, in dropdown on < xl)
  // - overflow items: always in dropdown
  const { allWorksItem, featuredItems, overflowItems } = useMemo(() => {
    const all = seriesList.find((s) => s.id === "all") || { id: "all", name: "All Works", count: 0 };
    const otherSeries = seriesList.filter((s) => s.id !== "all");

    // Match configured featured series IDs
    const featured: SeriesItem[] = [];
    for (const id of portfolioConfig.featuredSeriesIds) {
      const found = otherSeries.find((s) => s.id === id || s.name.toLowerCase() === id.toLowerCase());
      if (found && !featured.some((f) => f.id === found.id)) {
        featured.push(found);
      }
    }

    // If fewer than 3 configured or found, pad from remaining by count descending
    if (featured.length < 3) {
      const remaining = otherSeries
        .filter((s) => !featured.some((f) => f.id === s.id))
        .sort((a, b) => b.count - a.count);
      for (const s of remaining) {
        if (featured.length >= 3) break;
        featured.push(s);
      }
    }

    // Remaining collections become base overflow
    const overflow = otherSeries.filter((s) => !featured.some((f) => f.id === s.id));

    return {
      allWorksItem: all,
      featuredItems: featured,
      overflowItems: overflow,
    };
  }, [seriesList]);

  // Check if activeSeries is currently in the "More" dropdown for the user's active screen
  const activeSeriesItem = seriesList.find((s) => s.id === activeSeries);
  const isFeaturedActive = featuredItems.some((f) => f.id === activeSeries);
  const isAllActive = activeSeries === "all";
  const hasActiveInMore = !isAllActive && (!isFeaturedActive || overflowItems.some((o) => o.id === activeSeries));

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#09090b]/80 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Photographer Signature */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/15 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d93829] shadow-[0_0_8px_#d93829]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-sm font-semibold tracking-wider uppercase text-zinc-100 font-mono">
                Mihail Kovashki
              </span>
              <span className="text-[10px] font-mono text-zinc-500 font-normal">
                / miko
              </span>
            </div>
            <span className="text-[11px] tracking-widest text-zinc-400 font-mono flex items-center gap-1.5 whitespace-nowrap">
              <span>FUJIFILM X-T5</span>
              <span className="hidden xl:inline text-zinc-600">·</span>
              <span className="hidden xl:inline text-zinc-400">Fujinon Glass</span>
            </span>
          </div>
        </div>

        {/* Responsive Quick Filter Nav:
            - Tablet (md: 768px+): All Works + 1 Collection + More
            - Small Desktop (lg: 1024px+): All Works + 2 Collections + More
            - Wide Desktop (xl: 1280px+): All Works + 3 Collections + More */}
        {seriesList.length > 0 && (
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 text-xs font-mono relative shrink-0">
            {/* All Works (Always visible on md+) */}
            <button
              onClick={() => onSelectSeries(allWorksItem.id)}
              className={`px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                activeSeries === allWorksItem.id
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {allWorksItem.name}
            </button>

            {/* Featured Collection #1: Always visible on md+ */}
            {featuredItems[0] && (
              <button
                onClick={() => onSelectSeries(featuredItems[0].id)}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                  activeSeries === featuredItems[0].id
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {featuredItems[0].name}
              </button>
            )}

            {/* Featured Collection #2: Visible on lg (1024px+), tucked in More on md */}
            {featuredItems[1] && (
              <button
                onClick={() => onSelectSeries(featuredItems[1].id)}
                className={`hidden lg:inline-block px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                  activeSeries === featuredItems[1].id
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {featuredItems[1].name}
              </button>
            )}

            {/* Featured Collection #3: Visible on xl (1280px+), tucked in More on md/lg */}
            {featuredItems[2] && (
              <button
                onClick={() => onSelectSeries(featuredItems[2].id)}
                className={`hidden xl:inline-block px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                  activeSeries === featuredItems[2].id
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {featuredItems[2].name}
              </button>
            )}

            {/* Responsive "More" Dropdown: adapts to screen size */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                  hasActiveInMore
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
                aria-expanded={isMoreOpen}
                title="More collections"
              >
                <span>{hasActiveInMore && activeSeriesItem ? activeSeriesItem.name : "More"}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isMoreOpen ? "rotate-180" : ""}`} />
              </button>

              {isMoreOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 py-1.5 bg-[#121215]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1 text-[10px] uppercase tracking-wider text-zinc-500 font-mono border-b border-white/5 mb-1">
                    Other Collections
                  </div>

                  {/* Featured #2 appears in dropdown only on md (< 1024px) */}
                  {featuredItems[1] && (
                    <button
                      onClick={() => {
                        onSelectSeries(featuredItems[1].id);
                        setIsMoreOpen(false);
                      }}
                      className={`lg:hidden w-full text-left px-3.5 py-2 text-xs font-mono transition-colors flex items-center justify-between ${
                        activeSeries === featuredItems[1].id
                          ? "text-white bg-white/10 font-semibold"
                          : "text-zinc-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{featuredItems[1].name}</span>
                      <span className="text-[10px] text-zinc-500">{featuredItems[1].count}</span>
                    </button>
                  )}

                  {/* Featured #3 appears in dropdown on md & lg (< 1280px) */}
                  {featuredItems[2] && (
                    <button
                      onClick={() => {
                        onSelectSeries(featuredItems[2].id);
                        setIsMoreOpen(false);
                      }}
                      className={`xl:hidden w-full text-left px-3.5 py-2 text-xs font-mono transition-colors flex items-center justify-between ${
                        activeSeries === featuredItems[2].id
                          ? "text-white bg-white/10 font-semibold"
                          : "text-zinc-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{featuredItems[2].name}</span>
                      <span className="text-[10px] text-zinc-500">{featuredItems[2].count}</span>
                    </button>
                  )}

                  {/* Overflow items (always in dropdown) */}
                  {overflowItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectSeries(item.id);
                        setIsMoreOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-mono transition-colors flex items-center justify-between ${
                        activeSeries === item.id
                          ? "text-white bg-white/10 font-semibold"
                          : "text-zinc-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{item.name}</span>
                      <span className="text-[10px] text-zinc-500">{item.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        )}

        {/* Action Cluster: Instagram & Gear */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Instagram link: compact icon on tablet (< xl), full handle on desktop (xl+) */}
          <a
            href="https://www.instagram.com/mi_ko.jpg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @mi_ko.jpg"
            className="flex items-center justify-center gap-1.5 text-xs font-mono w-8 h-8 xl:w-auto xl:h-auto xl:px-3 xl:py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all duration-200 group"
          >
            <Instagram className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#e1306c] transition-colors" />
            <span className="hidden xl:inline">@mi_ko.jpg</span>
          </a>

          {/* Camera & Setup: says 'Gear' on tablet (< lg), 'Camera & Setup' on desktop (lg+) */}
          <button
            onClick={onOpenGear}
            className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors whitespace-nowrap"
          >
            <Camera className="w-3.5 h-3.5 text-[#e59866]" />
            <span className="hidden lg:inline">Camera & Setup</span>
            <span className="inline lg:hidden">Gear</span>
          </button>
        </div>
      </div>
    </header>
  );
}
