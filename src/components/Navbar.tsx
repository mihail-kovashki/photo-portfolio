"use client";

import { useState, useEffect } from "react";
import { Camera, Instagram, ChevronDown } from "lucide-react";
import { trips, tripOf, ALL_SERIES_ID } from "@/data/photos";

// The latest trips get their own button where the header has room: one from md (where
// the nav appears), two from lg, three from xl
const highlightedTrips = trips.slice(0, 3);
const highlightVisibility = ["flex", "hidden lg:flex", "hidden xl:flex"];
// Below those widths a highlighted trip has no button, so "Trips" stands in for it
const tripsLitUntil = [
  "",
  "lg:bg-transparent lg:text-zinc-400 lg:font-normal lg:shadow-none lg:hover:text-white",
  "xl:bg-transparent xl:text-zinc-400 xl:font-normal xl:shadow-none xl:hover:text-white",
];

interface NavbarProps {
  onOpenGear: () => void;
  activeSeries: string;
  onSelectSeries: (seriesId: string) => void;
  /** Opens the index of every trip. */
  onOpenTrips: () => void;
}

export function Navbar({ onOpenGear, activeSeries, onSelectSeries, onOpenTrips }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = activeSeries === ALL_SERIES_ID;
  const activeTripId = tripOf(activeSeries)?.id;
  const highlightIndex = highlightedTrips.findIndex((t) => t.id === activeTripId);
  const navButton = (isActive: boolean) =>
    `px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
      isActive ? "bg-white text-zinc-950 font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
    }`;

  return (
    // The divider is always there, transparent at the top, so scrolling only fades its
    // colour in. Adding the border on scroll made it start at the text colour and flash
    <header
      className={`fixed top-0 left-0 right-0 z-40 border-b transition-[background-color,border-color,box-shadow,padding,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled
          ? "bg-[#09090b]/80 backdrop-blur-md border-white/10 py-3 shadow-2xl"
          : "bg-transparent border-transparent py-5"
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
            <span className="text-[11px] tracking-widest uppercase text-zinc-400 font-mono flex items-center gap-1.5 whitespace-nowrap">
              <span>Photo journal</span>
              <span className="hidden xl:inline text-zinc-600">·</span>
              <span className="hidden xl:inline text-zinc-400">Film recipes</span>
            </span>
          </div>
        </div>

        {/* Site navigation from md: home, the latest trips, and the trip index for everything */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 text-xs font-mono shrink-0">
          <button onClick={() => onSelectSeries(ALL_SERIES_ID)} className={navButton(isHome)}>
            All Works
          </button>
          {highlightedTrips.map((trip, i) => (
            <button
              key={trip.id}
              onClick={() => onSelectSeries(trip.places[0].id)}
              className={`${highlightVisibility[i]} ${navButton(trip.id === activeTripId)}`}
            >
              {trip.name}
            </button>
          ))}
          {/* Lit on any place whose trip has no button of its own at this width */}
          <button
            onClick={onOpenTrips}
            aria-haspopup="dialog"
            className={navButton(!isHome && highlightIndex !== 0) + (highlightIndex > 0 ? ` ${tripsLitUntil[highlightIndex]}` : "")}
          >
            <span>Trips</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </nav>

        {/* Action Cluster: Instagram & Gear */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Instagram link and Camera & Setup: compact below 930px, full labels from 930px,
              the narrowest width where both fit with the trips beside them */}
          <a
            href="https://www.instagram.com/mi_ko.jpg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @mi_ko.jpg"
            className="flex items-center justify-center gap-1.5 text-xs font-mono w-8 h-8 min-[930px]:w-auto min-[930px]:h-auto min-[930px]:px-3 min-[930px]:py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all duration-200 group"
          >
            <Instagram className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#e1306c] transition-colors" />
            <span className="hidden min-[930px]:inline">@mi_ko.jpg</span>
          </a>

          <button
            onClick={onOpenGear}
            className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors whitespace-nowrap"
          >
            <Camera className="w-3.5 h-3.5 text-[#e59866]" />
            <span className="hidden min-[930px]:inline">Camera & Setup</span>
            <span className="inline min-[930px]:hidden">Gear</span>
          </button>
        </div>
      </div>
    </header>
  );
}
