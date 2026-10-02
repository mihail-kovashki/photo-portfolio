"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LayoutGrid, GalleryVerticalEnd, ChevronDown } from "lucide-react";
import { trips, tripOf, ALL_SERIES_ID } from "@/data/photos";

interface SeriesFilterProps {
  activeSeries: string;
  onSelectSeries: (id: string) => void;
  /** Opens the index of every trip. */
  onOpenTrips: () => void;
  layoutMode: "masonry" | "story";
  onToggleLayout: (mode: "masonry" | "story") => void;
}

// The pills are the places of one trip: the active place's, or on the home page the
// latest. Everything else is a tap away in the trip index.
export function SeriesFilter({
  activeSeries,
  onSelectSeries,
  onOpenTrips,
  layoutMode,
  onToggleLayout,
}: SeriesFilterProps) {
  const isHome = activeSeries === ALL_SERIES_ID;
  const trip = tripOf(activeSeries) ?? trips[0];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollAffordance = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollAffordance();

    el.addEventListener("scroll", updateScrollAffordance, { passive: true });
    window.addEventListener("resize", updateScrollAffordance, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      updateScrollAffordance();
    });
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollAffordance);
      window.removeEventListener("resize", updateScrollAffordance);
      resizeObserver.disconnect();
    };
  }, [updateScrollAffordance, trip]);

  // A trip with more places than fit: bring the active one into view
  useEffect(() => {
    const el = scrollRef.current;
    const active = el?.querySelector<HTMLElement>("[aria-current]");
    if (!el || !active) return;
    const left = active.offsetLeft - el.offsetLeft;
    if (left < el.scrollLeft || left + active.offsetWidth > el.scrollLeft + el.clientWidth) {
      el.scrollLeft = left - (el.clientWidth - active.offsetWidth) / 2;
    }
  }, [activeSeries]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current || e.button !== 0) return;
    setIsMouseDown(true);
    isDraggingRef.current = false;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  useEffect(() => {
    if (!isMouseDown) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!scrollRef.current) return;
      const x = e.pageX - scrollRef.current.offsetLeft;
      const distance = Math.abs(x - startXRef.current);
      if (distance > 5) {
        isDraggingRef.current = true;
      }
      const walk = (x - startXRef.current) * 1.3;
      scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    };

    const handleWindowMouseUp = () => {
      setIsMouseDown(false);
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 50);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isMouseDown]);

  const maskImage =
    canScrollLeft && canScrollRight
      ? "linear-gradient(to right, transparent, black 36px, black calc(100% - 36px), transparent 100%)"
      : canScrollRight
      ? "linear-gradient(to right, black calc(100% - 36px), transparent 100%)"
      : canScrollLeft
      ? "linear-gradient(to right, transparent, black 36px)"
      : undefined;

  return (
    <div id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 sm:mb-10 scroll-mt-24">
      {/* Where you are, and the way to everywhere else */}
      <div className="flex items-center justify-between gap-3 mb-2.5 sm:mb-3">
        <p className="min-w-0 truncate font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
          {isHome ? (
            <span>Latest trip</span>
          ) : (
            <button
              type="button"
              onClick={() => onSelectSeries(ALL_SERIES_ID)}
              className="uppercase hover:text-white transition-colors"
            >
              All works
            </button>
          )}
          {trip && (
            <>
              <span className="mx-2 text-zinc-700">/</span>
              <span className="text-zinc-300 normal-case tracking-normal">
                {trip.year} · {trip.name}
              </span>
            </>
          )}
        </p>
        <button
          type="button"
          onClick={onOpenTrips}
          aria-haspopup="dialog"
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors"
        >
          <span>All trips</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 pb-3 sm:pb-5 border-b border-white/10">
        {/* The trip's places: click-and-drag mouse scroll and a fade where there's more */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onWheel={(e) => {
            if (e.deltaY !== 0 && e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
          style={{
            scrollBehavior: isMouseDown ? "auto" : undefined,
            maskImage,
            WebkitMaskImage: maskImage,
          }}
          className={`flex items-center gap-2 overflow-x-auto py-1 scrollbar-none flex-1 min-w-0 ${
            isMouseDown ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
        >
          {trip?.places.map((item) => {
            const isActive = activeSeries === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!isDraggingRef.current) {
                    onSelectSeries(item.id);
                  }
                }}
                aria-current={isActive ? "page" : undefined}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 select-none ${
                  isActive
                    ? "bg-white text-zinc-950 font-semibold shadow-md"
                    : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                <span>{item.place}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-zinc-200 text-zinc-900" : "bg-white/10 text-zinc-400"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Layout Mode Switcher (Desktop & Tablet only) */}
        <div className="hidden sm:flex items-center justify-end shrink-0">
          <div className="flex items-center bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => onToggleLayout("masonry")}
              title="Masonry Gallery"
              className={`p-1.5 rounded-md transition-colors flex items-center gap-1.5 text-xs font-mono ${
                layoutMode === "masonry"
                  ? "bg-white/15 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => onToggleLayout("story")}
              title="Editorial Story Flow"
              className={`p-1.5 rounded-md transition-colors flex items-center gap-1.5 text-xs font-mono ${
                layoutMode === "story"
                  ? "bg-white/15 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <GalleryVerticalEnd className="w-4 h-4" />
              <span>Story</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
