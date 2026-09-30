"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useInView } from "framer-motion";
import { Maximize2 } from "lucide-react";
import type { Photo } from "@/data/photos";
import { formatSeasonYear, focalOrLens, exposureSummary } from "@/lib/utils";

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onOpen: (photo: Photo) => void;
  layoutMode?: "masonry" | "story";
}

// A photo "develops" out of its blurred preview once it has loaded and is on screen.
// When a row develops together it sweeps left to right: the delay follows the column
// the card actually sits in, so it holds whatever order or hiding curation.ts applies.
const DEVELOP_COLUMN_DELAY_MS = 90;

function setDevelopDelay(el: HTMLElement) {
  const grid = el.closest<HTMLElement>("[data-photo-grid]");
  if (!grid) return;
  const g = grid.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  if (!r.width) return;
  const columns = Math.max(1, Math.round(g.width / r.width));
  const column = Math.min(columns - 1, Math.max(0, Math.floor((r.left + r.width / 2 - g.left) / (g.width / columns))));
  el.style.setProperty("--develop-delay", `${column * DEVELOP_COLUMN_DELAY_MS}ms`);
}

interface DevelopingImageProps {
  src: string;
  alt: string;
  blurDataURL: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

function DevelopingImage({ src, alt, blurDataURL, sizes, priority, className }: DevelopingImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef, { once: true, amount: 0.15 });
  const [loaded, setLoaded] = useState(false);

  return (
    <div ref={wrapperRef} className="photo-develop absolute inset-0" data-developed={loaded && inView}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataURL}
        sizes={sizes}
        className={className}
        onLoad={() => {
          if (wrapperRef.current) setDevelopDelay(wrapperRef.current);
          setLoaded(true);
        }}
      />
    </div>
  );
}

// Cards contain block content, so they are buttons by role rather than <button>
const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#09090b]";

export function PhotoCard({ photo, index, onOpen, layoutMode = "masonry" }: PhotoCardProps) {
  const displayTitle = photo.title || photo.series;
  const season = formatSeasonYear(photo.dateTaken);
  const focal = focalOrLens(photo);
  const exposure = exposureSummary(photo);
  const openProps = {
    role: "button",
    tabIndex: 0,
    "aria-label": `Open ${[displayTitle, season].filter(Boolean).join(", ")}`,
    onClick: () => onOpen(photo),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpen(photo);
      }
    },
  };

  if (layoutMode === "story") {
    return (
      <article className="max-w-5xl mx-auto mb-10 sm:mb-14 group">
        {/* Story Photo Image */}
        <div
          {...openProps}
          data-photo-thumb={photo.id}
          className={`${FOCUS_RING} relative w-full overflow-hidden rounded-2xl cursor-pointer bg-zinc-900 border border-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-[1.008]`}
          style={{ aspectRatio: photo.aspectRatio }}
        >
          <DevelopingImage
            src={photo.displayUrl}
            alt={photo.title || `${photo.series} ${photo.fileNumber}`}
            priority={index < 2}
            blurDataURL={photo.blurDataUrl}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            className="object-cover transition-all duration-700 group-hover:scale-[1.02]"
          />


          {/* Expand icon on hover */}
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Story Caption & Technical Specs Drawer */}
        <div className="mt-3.5 px-1.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="text-base sm:text-lg font-serif tracking-wide text-zinc-100 group-hover:text-white transition-colors">
              {displayTitle}
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              {photo.title ? `${photo.series} · ` : ""}{season}
            </span>
          </div>

          {/* Technical Specs Strip in refined mono */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            {[
              { key: "focal", value: focal },
              { key: "aperture", value: photo.aperture, className: "text-zinc-300" },
              { key: "shutter", value: photo.shutterSpeed },
              { key: "iso", value: photo.iso },
            ]
              .filter((part) => part.value)
              .map((part, i) => (
                <span key={part.key} className="flex items-center gap-2">
                  {i > 0 && <span className="text-zinc-600">·</span>}
                  <span className={part.className}>{part.value}</span>
                </span>
              ))}
          </div>
        </div>
      </article>
    );
  }

  // Masonry Grid View
  return (
    <div
      {...openProps}
      className={`${FOCUS_RING} break-inside-avoid mb-6 group cursor-pointer rounded-xl`}
    >
      <div data-photo-thumb={photo.id} className="relative w-full overflow-hidden rounded-xl bg-zinc-900 border border-white/5 shadow-xl transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        {/* Aspect Ratio Container */}
        <div
          className="relative w-full overflow-hidden transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ aspectRatio: photo.aspectRatio }}
        >
          <DevelopingImage
            src={photo.thumbUrl}
            alt={photo.title || `${photo.series} ${photo.fileNumber}`}
            blurDataURL={photo.blurDataUrl}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />


          {/* Hover Expand Icon (Desktop only) */}
          <div className="hidden sm:block absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Overlay gradient (Desktop hover only) */}
          <div className="hidden sm:flex absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col justify-end p-4">
            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h4 className="text-base font-serif text-white tracking-wide">
                {displayTitle}
              </h4>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300 mt-1">
                <span className="text-zinc-400 font-medium">{focal}</span>
                <span className="text-zinc-300">
                  {exposure}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Editorial Caption (Underneath photo: 100% clean, undimmed image) */}
      <div className="sm:hidden mt-2.5 px-1 pb-1">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="text-sm font-serif text-zinc-100 tracking-wide truncate">
            {displayTitle}
          </h4>
          <span className="text-[10px] font-mono text-zinc-400 shrink-0">
            {focal}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mt-0.5">
          <span>{photo.title ? `${photo.series} · ` : ""}{season}</span>
          <span className="text-zinc-400">
            {exposure}
          </span>
        </div>
      </div>
    </div>
  );
}
