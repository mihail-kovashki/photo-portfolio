"use client";

import { useState, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { photos } from "@/data/photos";

interface PlaceInfo {
  name: string;
  seriesId: string;
  seriesName: string;
}

const PLACES: PlaceInfo[] = [
  { name: "Prague", seriesId: "prague-26", seriesName: "Prague 26" },
  { name: "Seoul", seriesId: "seoul-25", seriesName: "Seoul 25" },
  { name: "Hokkaido", seriesId: "hokkaido-25", seriesName: "Hokkaido 25" },
  { name: "Český Krumlov", seriesId: "cesky-krumlov-26", seriesName: "Český Krumlov 26" },
  { name: "Sokcho", seriesId: "sokcho-25", seriesName: "Sokcho 25" },
  { name: "Kutná Hora", seriesId: "kutna-hora-26", seriesName: "Kutna Hora 26" },
];

interface HeroProps {
  onSelectSeries?: (seriesId: string) => void;
}

export function Hero({ onSelectSeries }: HeroProps) {
  const [index, setIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWordHovered, setIsWordHovered] = useState(false);

  // Mouse tracking with smooth photographic spring inertia
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const springX = useSpring(mouseX, { stiffness: 140, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 140, damping: 20 });

  // Optical lens spotlight gradients (preserving user's custom tuned levels)
  const ambientLensGlow = useMotionTemplate`radial-gradient(520px circle at ${springX}px ${springY}px, rgba(217, 100, 41, 0.15) 0%, rgba(245, 158, 11, 0.15) 32%, rgba(255, 255, 255, 0.02) 55%, transparent 75%)`;
  const specularCore = useMotionTemplate`radial-gradient(180px circle at ${springX}px ${springY}px, rgba(255, 255, 255, 0.15), transparent 70%)`;

  const currentPlace = PLACES[index];

  // All photos matching the current place series
  const seriesPhotos = useMemo(() => {
    return photos.filter((p) => p.series === currentPlace.seriesName);
  }, [currentPlace.seriesName]);

  // Selected random preview photograph
  const previewPhoto = useMemo(() => {
    if (seriesPhotos.length === 0) return photos[0];
    return seriesPhotos[photoIndex % seriesPhotos.length];
  }, [seriesPhotos, photoIndex]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PLACES.length);
      // Pick a random photo index for the incoming place
      setPhotoIndex(Math.floor(Math.random() * 20));
    }, 2800);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setIsHovered(true);
    handleMouseMove(e);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPaused(false);
    setIsWordHovered(false);
  };

  const handleWordHoverStart = () => {
    setIsPaused(true);
    if (seriesPhotos.length > 1) {
      let next = Math.floor(Math.random() * seriesPhotos.length);
      if (next === photoIndex) {
        next = (next + 1) % seriesPhotos.length;
      }
      setPhotoIndex(next);
    }
    setIsWordHovered(true);
  };

  const handleCityClick = (seriesId: string) => {
    if (onSelectSeries) {
      onSelectSeries(seriesId);
    }
    const galleryEl = document.getElementById("gallery");
    if (galleryEl) {
      galleryEl.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 380, behavior: "smooth" });
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full pt-16 sm:pt-24 pb-4 sm:pb-8 select-none"
    >
      {/* Optical Lens Spotlight Layer (feathered softly towards all component boundaries) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-700 ease-out"
        style={{
          opacity: isHovered ? 1 : 0,
          maskImage:
            "radial-gradient(ellipse 80% 65% at 50% 50%, black 15%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 65% at 50% 50%, black 15%, transparent 80%)",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ background: ambientLensGlow }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ background: specularCore }}
        />
      </motion.div>

      {/* Interactive Floating Photo Peek (soft, understated photographic slide) */}
      <AnimatePresence>
        {isWordHovered && previewPhoto && (
          <motion.div
            key={previewPhoto.id}
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              left: springX,
              top: springY,
            }}
            className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-[calc(100%+28px)] hidden sm:block w-40 sm:w-44 rounded-md overflow-hidden bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.65)]"
          >
            {/* Soft Photographic Frame */}
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-zinc-950">
              <img
                src={previewPhoto.thumbUrl}
                alt={currentPlace.name}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />
            </div>

            {/* Understated Editorial Caption */}
            <div className="px-2 py-1.5 flex items-center justify-between text-[9px] font-mono text-zinc-400 bg-black/40">
              <span className="tracking-wide text-zinc-300 font-medium">
                {currentPlace.name}
              </span>
              <span className="tracking-wider text-zinc-500">
                {previewPhoto.aperture} · {previewPhoto.focalLength}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center"
      >
        {/* Editorial Heading with Hierarchical Scale Contrast */}
        <h1
          aria-label={`Visual Notes from ${PLACES.map((p) => p.name).join(", ")}`}
          className="max-w-4xl mb-4 sm:mb-6 cursor-default flex flex-col items-center"
        >
          {/* Subdued Premise / Lead-in */}
          <span className="text-lg sm:text-2xl md:text-3xl font-serif text-zinc-400/90 font-light tracking-normal leading-relaxed">
            Visual Notes from
          </span>

          {/* Monumental Hero Subject (City Flipper) */}
          <span className="block mt-1 sm:mt-2 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight text-white leading-[1.15]">
            <span
              className="inline-block h-[1.38em] overflow-hidden relative cursor-pointer px-3 sm:px-5"
              aria-hidden="true"
              onMouseEnter={handleWordHoverStart}
              onMouseLeave={() => {
                setIsPaused(false);
                setIsWordHovered(false);
              }}
              onClick={() => handleCityClick(currentPlace.seriesId)}
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={currentPlace.name}
                  initial={{ y: "110%", opacity: 0, filter: "blur(6px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: "-110%", opacity: 0, filter: "blur(6px)" }}
                  transition={{
                    y: { type: "spring", stiffness: 240, damping: 24 },
                    opacity: { duration: 0.28 },
                    filter: { duration: 0.24 },
                  }}
                  className="block italic font-normal text-white hover:text-zinc-100 transition-colors underline decoration-white/20 underline-offset-[8px] sm:underline-offset-[12px] decoration-dotted hover:decoration-white/60 whitespace-nowrap px-1"
                >
                  {currentPlace.name}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
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
