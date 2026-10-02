"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import type { ResolvedChapter } from "@/data/photos";
import { useHistorySheet, useSwipeToClose } from "@/lib/dialog";

interface ChapterBarProps {
  chapters: ResolvedChapter[];
}

export const chapterSectionId = (chapter: ResolvedChapter) => `chapter-${chapter.id}`;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Sticks under the navbar while a place's chapters scroll by, naming the one in view.
 * Tapping it lists every chapter (a bottom sheet on phones, a dropdown from sm) to jump to.
 * top-[60px] is the navbar's height once scrolled; PhotoGrid's scroll-mt on the chapter
 * sections clears both, so a jump lands the chapter header just below the bar.
 */
export function ChapterBar({ chapters }: ChapterBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const sheet = useHistorySheet(isOpen, () => setIsOpen(false));
  const { close } = sheet;
  const swipe = useSwipeToClose(isOpen, close);

  // The chapter in view is the last one whose top has come within a header's padding of
  // the bar, which is where a jump lands it. -1 until the bar sticks, while it still
  // rests above the first chapter. At the foot of the page the last chapter counts even
  // when it's too short to reach the bar.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const bar = barRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const isStuck = rect.top <= parseFloat(getComputedStyle(bar).top) + 1;
      let index = -1;
      if (isStuck) {
        chapters.forEach((chapter, i) => {
          const section = document.getElementById(chapterSectionId(chapter));
          if (section && section.getBoundingClientRect().top <= rect.bottom + 48) index = i;
        });
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom && index >= 0) index = chapters.length - 1;
      setCurrent(index);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [chapters]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const handlePointerDown = (e: PointerEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) close();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, close]);

  const toggle = () => {
    if (isOpen) {
      close();
    } else {
      setIsOpen(true);
      sheet.open();
    }
  };

  const jumpTo = useCallback(
    (chapter: ResolvedChapter) => {
      close(() => document.getElementById(chapterSectionId(chapter))?.scrollIntoView({ block: "start" }));
    },
    [close]
  );

  const active = chapters[current];

  return (
    <div ref={barRef} className="sticky top-[60px] z-30 -mx-4 sm:mx-0 mb-6 sm:mb-8">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="chapter-list"
        className="w-full flex items-center gap-3 px-4 py-3 sm:rounded-full bg-[#09090b]/85 backdrop-blur-md border-y sm:border border-white/10 text-left hover:bg-white/[0.06] transition-colors"
      >
        {active ? (
          <>
            <span className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 shrink-0">{pad(current + 1)}</span>
            <span className="font-serif text-base text-zinc-100 truncate">{active.name}</span>
          </>
        ) : (
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            {chapters.length} chapters
          </span>
        )}
        <span className="ml-auto flex items-center gap-2 shrink-0 font-mono text-[11px] text-zinc-500">
          {active && (
            <span>
              {current + 1}/{chapters.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dims the page behind the sheet on phones; a tap on it closes */}
            <motion.div
              key="chapter-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => close()}
              className="sm:hidden fixed inset-0 z-40 bg-black/60"
            />
            <motion.nav
              key="chapter-list"
              id="chapter-list"
              aria-label="Chapters"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={swipe.exit ?? { opacity: 0, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              {...swipe.sheetProps}
              className="fixed z-50 inset-x-0 bottom-0 max-h-[70vh] flex flex-col rounded-t-2xl sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-full sm:mt-2 sm:w-96 sm:max-h-[60vh] sm:rounded-2xl bg-[#121215]/95 backdrop-blur-xl border border-white/15 shadow-2xl"
            >
              {/* Handle and title: on phones, drag down from here to close */}
              <div {...swipe.handleProps} className="shrink-0 border-b border-white/5">
                <div className="sm:hidden mx-auto mt-2 h-1 w-10 rounded-full bg-white/20" />
                <div className="flex items-center justify-between pl-4 pr-2 py-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Chapters</span>
                  <button
                    type="button"
                    onClick={() => close()}
                    aria-label="Close chapters"
                    className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <ul className="overflow-y-auto overscroll-contain py-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-1.5">
                {chapters.map((chapter, i) => {
                  const cover = chapter.photos[0];
                  const isCurrent = i === current;
                  return (
                    <li key={chapter.id}>
                      <button
                        type="button"
                        onClick={() => jumpTo(chapter)}
                        aria-current={isCurrent ? "location" : undefined}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          isCurrent ? "bg-white/10" : "hover:bg-white/5"
                        }`}
                      >
                        <span className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 w-5 shrink-0">{pad(i + 1)}</span>
                        {cover && (
                          <Image
                            src={cover.thumbUrl}
                            alt=""
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-md object-cover shrink-0 bg-white/5"
                          />
                        )}
                        <span className={`font-serif text-[15px] leading-snug ${isCurrent ? "text-white" : "text-zinc-200"}`}>
                          {chapter.name}
                        </span>
                        <span className="ml-auto pl-2 font-mono text-[11px] text-zinc-500 shrink-0">{chapter.photos.length}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
