"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { trips, photos, ALL_SERIES_ID, type Trip } from "@/data/photos";
import { useBodyScrollLock, useDialogFocus, useSwipeToClose } from "@/lib/dialog";

interface TripIndexProps {
  isOpen: boolean;
  /** Closes the sheet, then runs `then` (see useHistorySheet). */
  onClose: (then?: () => void) => void;
  activeSeries: string;
  onSelectSeries: (seriesId: string) => void;
}

// Years newest first, each with its trips; the order of `trips` already is.
const years: { year: string; trips: Trip[] }[] = [];
for (const trip of trips) {
  const last = years[years.length - 1];
  if (last?.year === trip.year) last.trips.push(trip);
  else years.push({ year: trip.year, trips: [trip] });
}

/**
 * Every trip and its places, grouped by year: the way to anywhere on the site. A
 * bottom sheet on phones, a panel under the header from sm.
 */
export function TripIndex({ isOpen, onClose, activeSeries, onSelectSeries }: TripIndexProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  useBodyScrollLock(isOpen);
  useDialogFocus(dialogRef, isOpen);
  const swipe = useSwipeToClose(isOpen, () => onClose());

  // Open on the current trip: with years of trips, the current one can be far down
  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>("[aria-current]");
    if (!isOpen || !list || !active) return;
    const trip = active.closest("li") ?? active;
    const top = trip.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;
    list.scrollTop = top - (list.clientHeight - trip.offsetHeight) / 2;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const select = (seriesId: string) => onClose(() => onSelectSeries(seriesId));

  const pill = (isActive: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-colors flex items-center gap-2 ${
      isActive
        ? "bg-white text-zinc-950 font-semibold"
        : "bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5"
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="trip-index-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => onClose()}
          className="fixed inset-0 z-50 flex items-end sm:items-start sm:justify-center sm:pt-20 sm:px-6 bg-black/70 sm:bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="trip-index-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={swipe.exit ?? { opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            {...swipe.sheetProps}
            className="w-full sm:max-w-xl max-h-[80vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-[#121215] border border-white/15 shadow-2xl outline-none"
          >
            {/* Handle and title: on phones, drag down from here to close */}
            <div {...swipe.handleProps} className="shrink-0">
              <div className="sm:hidden mx-auto mt-2 h-1 w-10 rounded-full bg-white/20" />
              <div className="flex items-center justify-between gap-3 px-5 pt-3 sm:pt-5 pb-3 border-b border-white/10">
                <h2 id="trip-index-title" className="font-serif text-xl text-white tracking-tight">
                  Trips
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => select(ALL_SERIES_ID)}
                    className={pill(activeSeries === ALL_SERIES_ID)}
                  >
                    <span>All works</span>
                    <span className="text-[10px] opacity-60">{photos.length}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onClose()}
                    aria-label="Close"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div ref={listRef} className="overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]">
              {years.map(({ year, trips: yearTrips }) => (
                <section key={year} aria-labelledby={`trip-year-${year}`}>
                  {/* Each year's heading sticks while its trips scroll by */}
                  <h3
                    id={`trip-year-${year}`}
                    className="sticky top-0 z-10 px-5 py-2 bg-[#121215]/95 backdrop-blur-md font-mono text-[11px] tracking-[0.2em] text-zinc-500 border-b border-white/5"
                  >
                    {year}
                  </h3>
                  <ul>
                    {yearTrips.map((trip) => (
                      <li key={trip.id} className="px-5 py-3 border-b border-white/5 last:border-b-0">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="font-serif text-lg text-zinc-100">{trip.name}</span>
                          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                            {trip.season}
                          </span>
                          <span className="ml-auto font-mono text-[11px] text-zinc-600">{trip.count}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {trip.places.map((place) => {
                            const isActive = place.id === activeSeries;
                            return (
                              <button
                                key={place.id}
                                type="button"
                                onClick={() => select(place.id)}
                                aria-current={isActive ? "page" : undefined}
                                className={pill(isActive)}
                              >
                                <span>{place.place}</span>
                                <span className="text-[10px] opacity-60">{place.count}</span>
                              </button>
                            );
                          })}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
