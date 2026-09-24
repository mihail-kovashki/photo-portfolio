"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Camera,
  Aperture,
  Clock,
  Zap,
  RotateCcw
} from "lucide-react";
import type { Photo } from "@/data/photos";
import { formatSeasonYear } from "@/lib/utils";

interface LightboxProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onNavigate: (photo: Photo) => void;
}

// Directional slide variants: starts completely off-screen with opacity 0 to eliminate flicker
const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : dir < 0 ? "-100%" : 0,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 350, damping: 35 },
      opacity: { duration: 0.25 },
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : dir < 0 ? "100%" : 0,
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 350, damping: 35 },
      opacity: { duration: 0.2 },
    },
  }),
};

export function Lightbox({ photo, photos, onClose, onNavigate }: LightboxProps) {
  const [showInfo, setShowInfo] = useState(true);
  const [showDesktopHint, setShowDesktopHint] = useState(false);

  // Lock background body scroll & remove scrollbar when Lightbox is open, preserving exact scroll position
  useEffect(() => {
    if (!photo || typeof window === "undefined") return;

    const scrollY = window.scrollY;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;

    // Compensate for scrollbar width on desktop to prevent background layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;

      const prevBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({ top: scrollY, behavior: "instant" });
      document.documentElement.style.scrollBehavior = prevBehavior;
    };
  }, [Boolean(photo)]);

  // First-time ephemeral zoom hint for desktop: only triggers when a photo is actually open
  useEffect(() => {
    if (!photo || typeof window === "undefined") return;
    try {
      const hasSeen = sessionStorage.getItem("lightbox_zoom_hint_seen");
      if (!hasSeen) {
        setShowDesktopHint(true);
        const timer = setTimeout(() => {
          setShowDesktopHint(false);
          sessionStorage.setItem("lightbox_zoom_hint_seen", "true");
        }, 20000);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, [photo?.id]);

  // Pinch-to-zoom & pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  // Synchronous refs to prevent stale closures during rapid touch events
  const scaleRef = useRef(scale);
  scaleRef.current = scale;
  const positionRef = useRef(position);
  positionRef.current = position;

  const isZoomed = scale > 1.05;

  // Touch & pan tracking refs
  const pinchStartRef = useRef<{
    dist: number;
    startScale: number;
    midX: number;
    midY: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  const panStartRef = useRef<{
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastDoubleTapTimeRef = useRef<number>(0);
  const mousePanStartRef = useRef<{
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
    hasMoved: boolean;
  } | null>(null);

  // Reset zoom on photo change
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    scaleRef.current = 1;
    positionRef.current = { x: 0, y: 0 };
    setIsPinching(false);
    setIsPanning(false);
  }, [photo?.id]);

  const [direction, setDirection] = useState(0);

  const currentIndex = photos.findIndex((p) => p.id === photo?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      setDirection(-1);
      onNavigate(photos[currentIndex - 1]);
    }
  }, [hasPrev, currentIndex, photos, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      setDirection(1);
      onNavigate(photos[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, photos, onNavigate]);

  // Proactively prefetch adjacent photos into browser cache for instantaneous swipe transitions
  useEffect(() => {
    if (!photo || typeof window === "undefined" || currentIndex < 0) return;

    const indicesToPreload = [currentIndex + 1, currentIndex + 2, currentIndex - 1];
    indicesToPreload.forEach((idx) => {
      if (idx >= 0 && idx < photos.length) {
        const targetPhoto = photos[idx];
        if (targetPhoto?.displayUrl) {
          const img = new window.Image();
          img.src = targetPhoto.displayUrl;
        }
      }
    });
  }, [currentIndex, photo, photos]);

  // Double tap / double click to toggle zoom
  const handleDoubleTap = useCallback((clientX: number, clientY: number) => {
    const currentScale = scaleRef.current;
    if (currentScale > 1.05) {
      // When already in zoom mode (via pinch or prior double tap), double-tap resets back to 1.0x (full view)
      setScale(1);
      setPosition({ x: 0, y: 0 });
      scaleRef.current = 1;
      positionRef.current = { x: 0, y: 0 };
    } else {
      // When at normal view, double-tap zooms in (2.5x) smoothly focused on the tapped point
      const targetScale = 2.5;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const maxPanX = (window.innerWidth * (targetScale - 1)) / 2;
      const maxPanY = (window.innerHeight * (targetScale - 1)) / 2;
      const offsetX = Math.min(Math.max((centerX - clientX) * 1.5, -maxPanX), maxPanX);
      const offsetY = Math.min(Math.max((centerY - clientY) * 1.5, -maxPanY), maxPanY);

      setScale(targetScale);
      setPosition({ x: offsetX, y: offsetY });
      setShowDesktopHint(false);
      try {
        sessionStorage.setItem("lightbox_zoom_hint_seen", "true");
      } catch {}
      scaleRef.current = targetScale;
      positionRef.current = { x: offsetX, y: offsetY };
    }
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 2 fingers: pinch-to-zoom start
      setIsPinching(true);
      setIsPanning(false);
      touchStartRef.current = null;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      pinchStartRef.current = {
        dist,
        startScale: scaleRef.current,
        midX: (t1.clientX + t2.clientX) / 2,
        midY: (t1.clientY + t2.clientY) / 2,
        startPosX: positionRef.current.x,
        startPosY: positionRef.current.y,
      };
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      // Pan tracking if zoomed in
      if (scaleRef.current > 1.05) {
        setIsPanning(true);
        panStartRef.current = {
          startX: touch.clientX,
          startY: touch.clientY,
          startPosX: positionRef.current.x,
          startPosY: positionRef.current.y,
        };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartRef.current) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const factor = currentDist / pinchStartRef.current.dist;
      const newScale = Math.min(Math.max(pinchStartRef.current.startScale * factor, 0.9), 4.5);
      setScale(newScale);
      scaleRef.current = newScale;

      const currentMidX = (t1.clientX + t2.clientX) / 2;
      const currentMidY = (t1.clientY + t2.clientY) / 2;
      const maxPanX = (window.innerWidth * (newScale - 1)) / 2;
      const maxPanY = (window.innerHeight * (newScale - 1)) / 2;
      const dx = currentMidX - pinchStartRef.current.midX;
      const dy = currentMidY - pinchStartRef.current.midY;

      const newPos = {
        x: Math.min(Math.max(pinchStartRef.current.startPosX + dx, -maxPanX), maxPanX),
        y: Math.min(Math.max(pinchStartRef.current.startPosY + dy, -maxPanY), maxPanY),
      };
      setPosition(newPos);
      positionRef.current = newPos;
    } else if (e.touches.length === 1 && panStartRef.current && scaleRef.current > 1.05) {
      e.preventDefault();
      const touch = e.touches[0];
      const dx = touch.clientX - panStartRef.current.startX;
      const dy = touch.clientY - panStartRef.current.startY;
      const maxPanX = (window.innerWidth * (scaleRef.current - 1)) / 2;
      const maxPanY = (window.innerHeight * (scaleRef.current - 1)) / 2;

      const newPos = {
        x: Math.min(Math.max(panStartRef.current.startPosX + dx, -maxPanX), maxPanX),
        y: Math.min(Math.max(panStartRef.current.startPosY + dy, -maxPanY), maxPanY),
      };
      setPosition(newPos);
      positionRef.current = newPos;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const wasPinching = pinchStartRef.current !== null;

    if (e.touches.length === 0) {
      setIsPinching(false);
      setIsPanning(false);
      pinchStartRef.current = null;
      panStartRef.current = null;

      // Only snap scale boundaries if the user was actively pinching
      if (wasPinching) {
        if (scaleRef.current < 1.05) {
          setScale(1);
          setPosition({ x: 0, y: 0 });
          scaleRef.current = 1;
          positionRef.current = { x: 0, y: 0 };
        } else if (scaleRef.current > 4) {
          setScale(4);
          scaleRef.current = 4;
        }
      }

      // Double tap detector (evaluated on tap release)
      if (e.changedTouches.length === 1 && touchStartRef.current) {
        const touch = e.changedTouches[0];
        const tapDuration = Date.now() - touchStartRef.current.time;
        const tapMoveDist = Math.hypot(
          touch.clientX - touchStartRef.current.x,
          touch.clientY - touchStartRef.current.y
        );

        // Valid quick tap (short duration, minimal finger movement)
        if (tapDuration < 280 && tapMoveDist < 15) {
          const now = Date.now();
          const lastTap = lastTapRef.current;

          if (
            lastTap &&
            now - lastTap.time < 320 &&
            Math.hypot(touch.clientX - lastTap.x, touch.clientY - lastTap.y) < 35
          ) {
            // Confirmed second tap: execute double-tap toggle
            lastTapRef.current = null;
            lastDoubleTapTimeRef.current = now;
            handleDoubleTap(touch.clientX, touch.clientY);
          } else {
            // First tap recorded
            lastTapRef.current = { x: touch.clientX, y: touch.clientY, time: now };
          }
        }
        touchStartRef.current = null;
      }
    } else if (e.touches.length === 1 && scaleRef.current > 1.05) {
      setIsPinching(false);
      setIsPanning(true);
      const touch = e.touches[0];
      panStartRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startPosX: positionRef.current.x,
        startPosY: positionRef.current.y,
      };
      pinchStartRef.current = null;
    }
  };

  // Desktop mouse drag panning when in zoom mode
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only handle primary (left) button and only when zoomed in
    if (e.button !== 0 || scaleRef.current <= 1.05) return;

    e.preventDefault();
    setIsPanning(true);
    mousePanStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: positionRef.current.x,
      startPosY: positionRef.current.y,
      hasMoved: false,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!mousePanStartRef.current) return;
      const dx = moveEvent.clientX - mousePanStartRef.current.startX;
      const dy = moveEvent.clientY - mousePanStartRef.current.startY;
      if (Math.hypot(dx, dy) > 4) {
        mousePanStartRef.current.hasMoved = true;
      }

      const currentScale = scaleRef.current;
      const maxPanX = (window.innerWidth * (currentScale - 1)) / 2;
      const maxPanY = (window.innerHeight * (currentScale - 1)) / 2;

      const newPos = {
        x: Math.min(Math.max(mousePanStartRef.current.startPosX + dx, -maxPanX), maxPanX),
        y: Math.min(Math.max(mousePanStartRef.current.startPosY + dy, -maxPanY), maxPanY),
      };
      setPosition(newPos);
      positionRef.current = newPos;
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      setTimeout(() => {
        mousePanStartRef.current = null;
      }, 80);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Scroll wheel & trackpad pinch zooming
  const handleWheel = (e: React.WheelEvent) => {
    // Allow zoom via trackpad pinch (ctrlKey/metaKey) OR mouse wheel when already zoomed in
    const isPinchGesture = e.ctrlKey || e.metaKey;
    const isAlreadyZoomed = scaleRef.current > 1.05;

    if (!isPinchGesture && !isAlreadyZoomed) {
      // Normal unzoomed view: keep page stable and prevent accidental zoom jumps
      return;
    }

    e.preventDefault();
    const currentScale = scaleRef.current;
    // Smoother sensitivity for wheel vs trackpad pinch
    const sensitivity = isPinchGesture ? 0.01 : 0.0025;
    const zoomFactor = -e.deltaY * sensitivity;
    const targetScale = Math.min(Math.max(currentScale + zoomFactor, 1), 4.5);

    if (targetScale <= 1.05) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      scaleRef.current = 1;
      positionRef.current = { x: 0, y: 0 };
    } else {
      // Smooth zoom centered towards mouse cursor position
      const ratio = targetScale / currentScale;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const mouseRelX = e.clientX - centerX - positionRef.current.x;
      const mouseRelY = e.clientY - centerY - positionRef.current.y;

      const maxPanX = (window.innerWidth * (targetScale - 1)) / 2;
      const maxPanY = (window.innerHeight * (targetScale - 1)) / 2;

      const newPos = {
        x: Math.min(Math.max(positionRef.current.x - mouseRelX * (ratio - 1), -maxPanX), maxPanX),
        y: Math.min(Math.max(positionRef.current.y - mouseRelY * (ratio - 1), -maxPanY), maxPanY),
      };

      setScale(targetScale);
      setPosition(newPos);
      scaleRef.current = targetScale;
      positionRef.current = newPos;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (scaleRef.current > 1.05) {
          setScale(1);
          setPosition({ x: 0, y: 0 });
          scaleRef.current = 1;
          positionRef.current = { x: 0, y: 0 };
        } else {
          onClose();
        }
      }
      if (scaleRef.current <= 1.05) {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }
      if (e.key === "i" || e.key === "I") setShowInfo((prev) => !prev);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, onClose]);


  if (!photo) return null;

  const displayTitle = photo.title || photo.series;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl touch-none select-none overflow-hidden"
        onWheel={handleWheel}
      >
        {/* Top Control Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          {/* Index Counter */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="text-white font-medium">{currentIndex + 1}</span>
            <span>/</span>
            <span>{photos.length}</span>
            <span className="hidden sm:inline text-zinc-600">·</span>
            <span className="hidden sm:inline text-zinc-400">{photo.series}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2.5 rounded-full border transition-colors ${
                showInfo
                  ? "bg-white text-zinc-950 border-white"
                  : "bg-white/5 text-zinc-400 hover:text-white border-white/10"
              }`}
              title="Toggle EXIF & Recipe Info (Press 'i')"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-colors"
              title="Close (Escape)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* First-time Zoom Hint (ephemeral, disappears after 3.5s or on zoom) */}
        <AnimatePresence>
          {showDesktopHint && !isZoomed && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex absolute top-14 sm:top-20 left-1/2 -translate-x-1/2 z-40 items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-400 pointer-events-none select-none shadow-lg"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#e59866] animate-pulse" />
              <span className="pointer-fine-only">Double-click to zoom</span>
              <span className="pointer-coarse-only">Pinch or double-tap to zoom</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Zoom Indicator & Reset Control */}
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-14 sm:top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono text-white shadow-xl cursor-pointer hover:bg-black/95 transition-colors"
              onClick={() => {
                setScale(1);
                setPosition({ x: 0, y: 0 });
                scaleRef.current = 1;
                positionRef.current = { x: 0, y: 0 };
              }}
              title="Click or double-tap to reset zoom"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#e59866]" />
              {/* Touchscreen label: compact & touch-accurate */}
              <span className="pointer-coarse-only">{Math.round(scale * 10) / 10}× · Tap to reset</span>
              {/* Desktop (Mouse/Trackpad) label: rich control legend */}
              <span className="pointer-fine-only inline-flex items-center gap-2">
                <span className="text-[#e59866] font-semibold">{Math.round(scale * 10) / 10}×</span>
                <span className="text-zinc-600">·</span>
                <span>Scroll to zoom</span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-300 underline decoration-white/20 underline-offset-2">Click to reset</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Previous Navigation Button (Desktop, hidden when zoomed) */}
        {hasPrev && !isZoomed && (
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all duration-200 hover:scale-110"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Next Navigation Button (Desktop, hidden when zoomed) */}
        {hasNext && !isZoomed && (
          <button
            onClick={handleNext}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all duration-200 hover:scale-110"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Main Image Stage Wrapper */}
        <div className="relative max-w-6xl md:max-w-7xl lg:max-w-[1400px] 2xl:max-w-[1850px] max-h-[74vh] sm:max-h-[84vh] md:max-h-[86vh] 2xl:max-h-[88vh] w-[92vw] 2xl:w-[90vw] h-[74vh] sm:h-[84vh] md:h-[86vh] 2xl:h-[88vh] landscape-stage-wrapper flex items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={photo.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag={!isZoomed ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{
                left: hasNext ? 0.35 : 0.06,
                right: hasPrev ? 0.35 : 0.06,
              }}
              onDragEnd={(_, info) => {
                if (isZoomed) return;
                const swipeThreshold = 50;
                const velocityThreshold = 250;

                // Swiping right (prev photo)
                if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
                  if (hasPrev) handlePrev();
                }
                // Swiping left (next photo)
                else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
                  if (hasNext) handleNext();
                }
              }}
              className={`absolute inset-x-0 top-0 bottom-12 sm:bottom-0 landscape-compact-stage flex items-center justify-center p-2 ${
                isZoomed
                  ? isPanning
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : "cursor-default"
              }`}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={(e) => {
                // Avoid triggering double-click zoom toggle if user was dragging the mouse
                if (mousePanStartRef.current?.hasMoved) return;
                // Avoid double firing when mobile browsers synthesize dblclick right after touch double-tap
                if (Date.now() - lastDoubleTapTimeRef.current < 600) return;
                handleDoubleTap(e.clientX, e.clientY);
              }}
            >
              {/* Zoom & Pan Motion Wrapper */}
              <motion.div
                animate={{
                  scale: scale,
                  x: position.x,
                  y: position.y,
                }}
                transition={
                  isPinching || isPanning
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 350, damping: 30 }
                }
                className="relative w-full h-full flex items-center justify-center"
                style={{ aspectRatio: photo.aspectRatio }}
              >
                <Image
                  src={photo.displayUrl}
                  alt={photo.title || `${photo.series} ${photo.fileNumber}`}
                  fill
                  priority
                  sizes="(max-width: 1400px) 100vw, (max-width: 2200px) 1850px, 2048px"
                  className="object-contain rounded-lg shadow-2xl pointer-events-none select-none"
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom EXIF & Camera HUD Drawer (auto-hides when zoomed) */}
        <AnimatePresence>
          {showInfo && !isZoomed && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-0 left-0 right-0 z-40 p-2.5 sm:p-6 pb-3 sm:pb-6 landscape-compact-drawer bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto"
            >
              <div className="relative max-w-4xl mx-auto flex flex-col gap-2 sm:gap-3 p-3 sm:p-5 landscape-compact-card rounded-xl sm:rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10">
                {/* Close Info Button */}
                <button
                  onClick={() => setShowInfo(false)}
                  className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white border border-white/5 hover:border-white/10 transition-colors"
                  title="Hide Info (Press 'i')"
                  aria-label="Hide info panel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 sm:gap-4 pr-7 sm:pr-10">
                  {/* Title & Series */}
                  <div>
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 landscape-compact-meta">
                      {photo.profile && (
                        <span className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded bg-white/10 text-zinc-300 landscape-compact-profile">
                          {photo.profile}
                        </span>
                      )}
                      <span className="text-[11px] sm:text-xs font-mono text-zinc-400">
                        {photo.title ? `${photo.series} · ${formatSeasonYear(photo.dateTaken)}` : formatSeasonYear(photo.dateTaken)}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-2xl landscape-compact-title font-serif text-white tracking-tight">
                      {displayTitle}
                    </h2>
                  </div>

                  {/* Mobile & Landscape-Phone Compact Hardware & Exposure Strip */}
                  <div className="hud-compact-only landscape-compact-pills flex items-center flex-wrap gap-1 text-[10px] font-mono text-zinc-300">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 border border-white/5">
                      <Camera className="w-2.5 h-2.5 text-[#d93829] shrink-0" />
                      <span>{photo.camera.replace("FUJIFILM ", "")}</span>
                      <span className="text-zinc-600">·</span>
                      <span>{photo.lens.replace(/^FUJINON\s+/i, "").replace(/\s+R\s+LM\s+OIS\s+WR$/i, "").replace(/\s+R\s+LM\s+WR$/i, "").replace(/\s+R\s+WR$/i, "")}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 border border-white/5">
                      <Aperture className="w-2.5 h-2.5 text-[#e59866] shrink-0" />
                      <span className="text-white font-semibold">{photo.aperture}</span>
                      <span className="text-zinc-600">·</span>
                      <span>{photo.shutterSpeed}</span>
                      <span className="text-zinc-600">·</span>
                      <span>{photo.iso}</span>
                    </div>
                  </div>

                  {/* Desktop & Large Tablet Full Hardware & Exposure Strip */}
                  <div className="hud-expanded-only flex items-center flex-wrap gap-2 text-xs font-mono text-zinc-300">
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

                {/* Recipe Dial Settings (SOOC JPEGs) */}
                {photo.recipeDetails && (
                  <div className="pt-2 sm:pt-2.5 landscape-compact-recipe border-t border-white/5 flex flex-wrap items-center gap-x-2.5 sm:gap-x-3.5 gap-y-0.5 sm:gap-y-1 text-[9.5px] sm:text-[11px] font-mono text-zinc-400">
                    <span className="text-[#e59866] uppercase tracking-wider text-[8px] sm:text-[9px] font-semibold">Recipe:</span>
                    <span>DR: <span className="text-zinc-200">{photo.recipeDetails.dynamicRange}</span></span>
                    <span>Tone: <span className="text-zinc-200">H{photo.recipeDetails.highlight !== undefined && photo.recipeDetails.highlight >= 0 ? '+' : ''}{photo.recipeDetails.highlight} / S{photo.recipeDetails.shadow !== undefined && photo.recipeDetails.shadow >= 0 ? '+' : ''}{photo.recipeDetails.shadow}</span></span>
                    <span>Color: <span className="text-zinc-200">{photo.recipeDetails.color !== undefined && photo.recipeDetails.color >= 0 ? '+' : ''}{photo.recipeDetails.color}</span></span>
                    <span>Grain: <span className="text-zinc-200">{photo.recipeDetails.grainEffect}</span></span>
                    <span>Chrome: <span className="text-zinc-200">{photo.recipeDetails.colorChromeEffect}</span></span>
                    {photo.recipeDetails.colorChromeFXBlue && photo.recipeDetails.colorChromeFXBlue !== 'Off' && (
                      <span>FX Blue: <span className="text-zinc-200">{photo.recipeDetails.colorChromeFXBlue}</span></span>
                    )}
                    <span>WB: <span className="text-zinc-200">{photo.recipeDetails.whiteBalance}</span></span>
                    {photo.recipeDetails.clarity !== 0 && photo.recipeDetails.clarity !== undefined && (
                      <span>Clarity: <span className="text-zinc-200">{photo.recipeDetails.clarity}</span></span>
                    )}
                    {photo.recipeDetails.noiseReduction !== undefined && (
                      <span>NR: <span className="text-zinc-200">{photo.recipeDetails.noiseReduction}</span></span>
                    )}
                    {photo.recipeDetails.exposureCompensation && photo.recipeDetails.exposureCompensation !== '0 EV' && (
                      <span>Exp: <span className="text-zinc-200">{photo.recipeDetails.exposureCompensation}</span></span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
