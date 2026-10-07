"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { places } from "@/data/photos";
import { preferredScrollBehavior } from "@/lib/utils";
import { useIntroPlaying } from "@/lib/intro";

// Departure-board flipper: the hero names a place and flips through the others once,
// oldest to newest, then settles back on the latest. Hovering starts another pass;
// clicking opens that place.
const FLIP_INTERVAL_MS = 2500;
// The first flip comes sooner, while visitors are still at the top of the page
const FIRST_FLIP_DELAY_MS = 1500;
const RESTART_DELAY_MS = 600;

const latestIndex = places.length - 1;

interface HeroProps {
  onSelectSeries?: (seriesId: string) => void;
}

export function Hero({ onSelectSeries }: HeroProps) {
  const reduceMotion = useReducedMotion();
  // Hold the first pass until the opening animation hands over, so it's seen from the start
  const introPlaying = useIntroPlaying();
  const [index, setIndex] = useState(latestIndex);
  // Flips left in the current pass. A full pass visits every place and ends on the latest.
  const [flipsLeft, setFlipsLeft] = useState(places.length);
  const [nextDelay, setNextDelay] = useState(FIRST_FLIP_DELAY_MS);

  useEffect(() => {
    if (reduceMotion || introPlaying || flipsLeft === 0 || places.length < 2) return;
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % places.length);
      setFlipsLeft((n) => n - 1);
      setNextDelay(FLIP_INTERVAL_MS);
    }, nextDelay);
    return () => clearTimeout(timer);
  }, [reduceMotion, introPlaying, flipsLeft, nextDelay]);

  const restartPass = () => {
    if (flipsLeft > 0) return;
    setNextDelay(RESTART_DELAY_MS);
    setFlipsLeft(places.length);
  };

  const place = places[index];

  const handlePlaceClick = () => {
    if (!place) return;
    onSelectSeries?.(place.id);
    document.getElementById("gallery")?.scrollIntoView({ behavior: preferredScrollBehavior() });
  };

  return (
    <section className="relative w-full pt-16 sm:pt-24 pb-4 sm:pb-8 select-none">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center"
      >
        {/* Editorial Heading with Hierarchical Scale Contrast */}
        <h1 className="max-w-4xl mb-4 sm:mb-6 cursor-default flex flex-col items-center">
          {/* Subdued Premise / Lead-in */}
          <span className="text-lg sm:text-2xl md:text-3xl font-serif text-zinc-400/90 font-light tracking-normal leading-relaxed">
            Visual Notes from
          </span>

          {/* Monumental Hero Subject (Destination Flipper) */}
          {place && (
            <span className="block mt-1 sm:mt-2 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight text-white leading-[1.15]">
              <button
                type="button"
                onClick={handlePlaceClick}
                onMouseEnter={restartPass}
                className="inline-block h-[1.38em] overflow-hidden relative cursor-pointer px-3 sm:px-5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={place.id}
                    initial={{ y: "110%", opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-110%", opacity: 0, filter: "blur(6px)" }}
                    transition={{
                      y: { type: "spring", stiffness: 240, damping: 24 },
                      opacity: { duration: 0.28 },
                      filter: { duration: 0.24 },
                    }}
                    className="block italic font-normal text-white hover:text-zinc-300 transition-colors whitespace-nowrap px-1"
                  >
                    {place.place}
                  </motion.span>
                </AnimatePresence>
              </button>
            </span>
          )}
        </h1>

        {/* Narrative Description (Monospace tag + clean Sans body) */}
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
