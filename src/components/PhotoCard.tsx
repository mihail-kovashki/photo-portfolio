"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import type { Photo } from "@/data/photos";

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onOpen: (photo: Photo) => void;
  layoutMode?: "masonry" | "story";
}

export function PhotoCard({ photo, index, onOpen, layoutMode = "masonry" }: PhotoCardProps) {
  const displayTitle = photo.title || photo.series;

  if (layoutMode === "story") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="max-w-5xl mx-auto mb-20 sm:mb-28 group"
      >
        {/* Story Photo Image */}
        <div
          onClick={() => onOpen(photo)}
          className="relative w-full overflow-hidden rounded-2xl cursor-pointer bg-zinc-900 border border-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
          style={{ aspectRatio: photo.aspectRatio }}
        >
          <Image
            src={photo.thumbUrl}
            alt={photo.title || `${photo.series} ${photo.fileNumber}`}
            fill
            placeholder="blur"
            blurDataURL={photo.blurDataUrl}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            className="object-cover transition-all duration-700 group-hover:scale-105"
          />

          {/* Profile / Raw Edit Badge */}
          {photo.profile && (
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-md backdrop-blur-md bg-black/60 text-zinc-200 border border-white/10">
                {photo.profile}
              </span>
            </div>
          )}

          {/* Expand icon on hover */}
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>

          {/* Subtle bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Story Caption & Technical Specs Drawer */}
        <div className="mt-4 px-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              {displayTitle}
            </h3>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              {photo.title ? `${photo.series} · ` : ""}{photo.dateTaken} · {photo.lens}
            </p>
          </div>

          {/* Camera Settings Strip */}
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-white/5 self-start sm:self-auto">
            <span>{photo.camera}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-200 font-semibold">{photo.aperture}</span>
            <span className="text-zinc-600">·</span>
            <span>{photo.shutterSpeed}</span>
            <span className="text-zinc-600">·</span>
            <span>{photo.iso}</span>
          </div>
        </div>
      </motion.article>
    );
  }

  // Masonry Grid View
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="break-inside-avoid mb-6 group cursor-pointer"
      onClick={() => onOpen(photo)}
    >
      <div className="relative w-full overflow-hidden rounded-xl bg-zinc-900 border border-white/5 shadow-xl transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        {/* Aspect Ratio Container */}
        <div
          className="relative w-full overflow-hidden transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ aspectRatio: photo.aspectRatio }}
        >
          <Image
            src={photo.thumbUrl}
            alt={photo.title || `${photo.series} ${photo.fileNumber}`}
            fill
            placeholder="blur"
            blurDataURL={photo.blurDataUrl}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />

          {/* Profile / Raw Edit Badge */}
          {photo.profile && (
            <div className="absolute top-3 left-3 z-10">
              <span className="text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded backdrop-blur-md bg-black/60 text-zinc-300 border border-white/10">
                {photo.profile}
              </span>
            </div>
          )}

          {/* Hover Expand Icon */}
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div className="transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-transform duration-300">
              <h4 className="text-base font-serif text-white tracking-wide">
                {displayTitle}
              </h4>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300 mt-1">
                <span className="text-zinc-400 font-medium">{photo.focalLength || photo.lens.replace(/^FUJINON\s+/i, "")}</span>
                <span className="text-zinc-300">
                  {photo.aperture} · {photo.shutterSpeed} · {photo.iso}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
