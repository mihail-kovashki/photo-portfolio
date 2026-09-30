"use client";

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

interface Placement {
  column: number;
  /** Sum of 1/aspectRatio of the photos above in the column: their height in column widths. */
  above: number;
  /** How many photos are above in the column, for the gaps between them. */
  count: number;
}

/**
 * Deals photos into columns, each to the shortest column so far, so a sequence reads
 * across rows. Returns each photo's placement and the CSS height of the tallest column.
 */
function deal(photos: Photo[], columns: number) {
  const heights = Array<number>(columns).fill(0);
  const counts = Array<number>(columns).fill(0);
  const placements: Placement[] = photos.map((photo) => {
    const column = heights.reduce((best, h, c) => (h < heights[best] - 0.01 ? c : best), 0);
    const placement = { column, above: heights[column], count: counts[column] };
    heights[column] += 1 / photo.aspectRatio;
    counts[column] += 1;
    return placement;
  });
  const height = `max(${heights.map((h, c) => `calc(var(--col) * ${h.toFixed(4)} + ${counts[c]} * var(--gap))`).join(", ")})`;
  return { placements, height };
}

// Two columns from sm, three from lg. The photos stay in sequence in the page, so tab
// order and screen readers follow it; CSS places each one (see .masonry in globals.css).
// Both layouts are computed here so the server renders the right one at any width.
function MasonrySet({ photos, onOpenPhoto, startIndex }: Omit<PhotoSetProps, "layoutMode"> & { startIndex: number }) {
  const two = deal(photos, 2);
  const three = deal(photos, 3);
  return (
    <div className="masonry">
      <div
        data-photo-grid
        className="masonry-grid"
        style={{ "--height-2": two.height, "--height-3": three.height } as React.CSSProperties}
      >
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="masonry-item"
            style={
              {
                "--column-2": two.placements[i].column,
                "--above-2": two.placements[i].above.toFixed(4),
                "--count-2": two.placements[i].count,
                "--column-3": three.placements[i].column,
                "--above-3": three.placements[i].above.toFixed(4),
                "--count-3": three.placements[i].count,
              } as React.CSSProperties
            }
          >
            <PhotoCard photo={photo} index={startIndex + i} onOpen={onOpenPhoto} layoutMode="masonry" />
          </div>
        ))}
      </div>
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
