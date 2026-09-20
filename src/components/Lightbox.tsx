"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Info, Camera, Aperture, Clock, Zap } from "lucide-react";
import type { Photo } from "@/data/photos";

interface LightboxProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onNavigate: (photo: Photo) => void;
}

export function Lightbox({ photo, photos, onClose, onNavigate }: LightboxProps) {
  const [showInfo, setShowInfo] = useState(true);

  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) onNavigate(photos[currentIndex - 1]);
  }, [hasPrev, photos, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) onNavigate(photos[currentIndex + 1]);
  }, [hasNext, photos, currentIndex, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "i" || e.key === "I") setShowInfo((prev) => !prev);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, onClose, handlePrev, handleNext]);

  // Prevent background scroll when lightbox is open
  useEffect(() => {
    if (photo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [photo]);

  if (!photo) return null;

  const displayTitle = photo.title || photo.series;
  const subtitle = photo.title ? `${photo.series} · ${photo.fileNumber}` : photo.fileNumber;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b]/96 backdrop-blur-2xl select-none"
      >
        {/* Top Floating Control Bar */}
        <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 sm:p-6">
          {/* Index Counter & Series */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              {currentIndex + 1} <span className="text-zinc-600">/</span> {photos.length}
            </span>
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              {photo.series}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2.5 rounded-full border transition-all duration-200 ${
                showInfo
                  ? "bg-white text-zinc-950 border-white"
                  : "bg-white/5 border-white/10 text-zinc-300 hover:text-white"
              }`}
              title="Toggle EXIF info (Press I)"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-colors"
              title="Close (Press Esc or swipe down)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Previous Navigation Button (Desktop) */}
        {hasPrev && (
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all duration-200 hover:scale-110"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Next Navigation Button (Desktop) */}
        {hasNext && (
          <button
            onClick={handleNext}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all duration-200 hover:scale-110"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Main Image Container with Touch Drag Navigation */}
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.25}
          onDragEnd={(_, info) => {
            // Horizontal swipe
            if (info.offset.x > 80) handlePrev();
            else if (info.offset.x < -80) handleNext();
            // Vertical pull down to dismiss
            else if (info.offset.y > 100) onClose();
          }}
          className="relative max-w-6xl max-h-[82vh] w-[92vw] h-[82vh] flex items-center justify-center cursor-grab active:cursor-grabbing p-2"
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ aspectRatio: photo.aspectRatio }}
          >
            <Image
              src={photo.displayUrl}
              alt={photo.title || `${photo.series} ${photo.fileNumber}`}
              fill
              priority
              placeholder="blur"
              blurDataURL={photo.blurDataUrl}
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-contain rounded-lg shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Bottom EXIF & Camera HUD Drawer */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-0 left-0 right-0 z-40 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent"
            >
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4 p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10">
                {/* Title & Series */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {photo.profile && (
                      <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                        {photo.profile}
                      </span>
                    )}
                    <span className="text-xs font-mono text-zinc-400">
                      {photo.series} · {subtitle}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif text-white tracking-tight">
                    {displayTitle}
                  </h2>
                </div>

                {/* Fujifilm Hardware & Exposure Strip */}
                <div className="flex items-center flex-wrap gap-2 text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
                    <Camera className="w-3.5 h-3.5 text-[#d93829]" />
                    <span>{photo.camera}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
                    <span>{photo.lens}</span>
                    {photo.focalLength && !photo.lens.includes(photo.focalLength) && (
                      <span className="text-zinc-400">({photo.focalLength})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
                    <Aperture className="w-3.5 h-3.5 text-[#e59866]" />
                    <span className="text-white font-semibold">{photo.aperture}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{photo.shutterSpeed}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
                    <Zap className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{photo.iso}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
