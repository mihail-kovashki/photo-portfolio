"use client";

import { PhotoCard } from "./PhotoCard";
import type { Photo } from "@/data/photos";

interface PhotoGridProps {
  photos: Photo[];
  onOpenPhoto: (photo: Photo) => void;
  layoutMode: "masonry" | "story";
}

export function PhotoGrid({ photos, onOpenPhoto, layoutMode }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-zinc-500 font-mono text-sm">No photographs found matching the current filters.</p>
      </div>
    );
  }

  if (layoutMode === "story") {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            onOpen={onOpenPhoto}
            layoutMode="story"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            onOpen={onOpenPhoto}
            layoutMode="masonry"
          />
        ))}
      </div>
    </div>
  );
}
