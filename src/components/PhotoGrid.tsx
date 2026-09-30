"use client";

import { useMemo, useSyncExternalStore } from "react";
import { PhotoCard } from "./PhotoCard";
import type { Photo, ResolvedChapter } from "@/data/photos";

type LayoutMode = "masonry" | "story";

interface PhotoGridProps {
  photos: Photo[];
  onOpenPhoto: (photo: Photo) => void;
  layoutMode: LayoutMode;
  /** A place's chapters, when it has a collection; photos then render under chapter headers. */
  chapters?: ResolvedChapter[];
}

interface PhotoSetProps {
  photos: Photo[];
  onOpenPhoto: (photo: Photo) => void;
  layoutMode: LayoutMode;
  /** Position of the first photo in the whole page, for image loading priority. */
  startIndex?: number;
}

function PhotoSet({ photos, onOpenPhoto, layoutMode, startIndex = 0 }: PhotoSetProps) {
  if (layoutMode === "story") {
    return (
      <>
        {photos.map((photo, i) => (
          <PhotoCard key={photo.id} photo={photo} index={startIndex + i} onOpen={onOpenPhoto} layoutMode="story" />
        ))}
      </>
    );
  }
  return <MasonrySet photos={photos} onOpenPhoto={onOpenPhoto} startIndex={startIndex} />;
}

// Tailwind's sm and lg breakpoints: 1, 2 or 3 columns.
const COLUMN_QUERIES = ["(min-width: 1024px)", "(min-width: 640px)"];

function columnCount() {
  if (window.matchMedia(COLUMN_QUERIES[0]).matches) return 3;
  if (window.matchMedia(COLUMN_QUERIES[1]).matches) return 2;
  return 1;
}

function subscribeColumns(onChange: () => void) {
  const lists = COLUMN_QUERIES.map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

/**
 * Deals photos into explicit columns, each to the shortest column so far, so the
 * sequence reads across rows. CSS columns would read down each column instead.
 */
function toColumns(photos: Photo[], count: number) {
  const columns = Array.from({ length: count }, () => ({ height: 0, items: [] as { photo: Photo; i: number }[] }));
  photos.forEach((photo, i) => {
    const shortest = columns.reduce((a, b) => (b.height < a.height - 0.01 ? b : a));
    shortest.items.push({ photo, i });
    shortest.height += 1 / photo.aspectRatio;
  });
  return columns.map((c) => c.items);
}

function MasonrySet({ photos, onOpenPhoto, startIndex }: Omit<PhotoSetProps, "layoutMode"> & { startIndex: number }) {
  // The server renders three columns; small screens re-deal after hydration.
  const count = useSyncExternalStore(subscribeColumns, columnCount, () => 3);
  const columns = useMemo(() => toColumns(photos, count), [photos, count]);
  return (
    <div data-photo-grid className="flex gap-6 items-start">
      {columns.map((column, c) => (
        <div key={c} className="flex-1 min-w-0">
          {column.map(({ photo, i }) => (
            <PhotoCard key={photo.id} photo={photo} index={startIndex + i} onOpen={onOpenPhoto} layoutMode="masonry" />
          ))}
        </div>
      ))}
    </div>
  );
}

function ChapterHeader({ chapter, number }: { chapter: ResolvedChapter; number: number }) {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex items-baseline gap-3 sm:gap-4">
        <span className="font-mono text-[11px] tracking-[0.2em] text-zinc-500">
          {String(number).padStart(2, "0")}
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-zinc-100">{chapter.name}</h2>
        <span className="font-mono text-xs text-zinc-500">{chapter.photos.length}</span>
      </div>
      {chapter.text && (
        <p className="mt-2 max-w-xl text-sm text-zinc-400 font-light leading-relaxed">{chapter.text}</p>
      )}
    </header>
  );
}

export function PhotoGrid({ photos, onOpenPhoto, layoutMode, chapters }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-zinc-500 font-mono text-sm">No photographs found matching the current filters.</p>
      </div>
    );
  }

  const container =
    layoutMode === "story"
      ? "max-w-6xl mx-auto px-4 sm:px-6 pb-4 sm:pb-16"
      : "max-w-7xl mx-auto px-4 sm:px-6 pb-4 sm:pb-20";

  if (!chapters || chapters.length === 0) {
    return (
      <div className={container}>
        <PhotoSet photos={photos} onOpenPhoto={onOpenPhoto} layoutMode={layoutMode} />
      </div>
    );
  }

  const offsets = chapters.map((_, i) =>
    chapters.slice(0, i).reduce((sum, c) => sum + c.photos.length, 0),
  );
  return (
    <div className={container}>
      {chapters.map((chapter, i) => {
        const offset = offsets[i];
        return (
          <section
            key={chapter.id}
            id={`chapter-${chapter.id}`}
            className={`scroll-mt-24 ${i > 0 ? "mt-14 sm:mt-20 pt-8 sm:pt-10 border-t border-white/10" : ""}`}
          >
            <ChapterHeader chapter={chapter} number={i + 1} />
            <PhotoSet photos={chapter.photos} onOpenPhoto={onOpenPhoto} layoutMode={layoutMode} startIndex={offset} />
          </section>
        );
      })}
    </div>
  );
}
