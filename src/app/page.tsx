"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SeriesFilter } from "@/components/SeriesFilter";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Lightbox } from "@/components/Lightbox";
import { GearModal } from "@/components/GearModal";
import { Footer } from "@/components/Footer";
import { photos, seriesList, type Photo } from "@/data/photos";

export default function Home() {
  const [activeSeries, setActiveSeries] = useState<string>("all");
  const [layoutMode, setLayoutMode] = useState<"masonry" | "story">("masonry");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isGearOpen, setIsGearOpen] = useState(false);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    if (activeSeries === "all") return photos;
    const target = seriesList.find((s) => s.id === activeSeries);
    if (!target) return photos;
    return photos.filter((photo) => photo.series === target.name);
  }, [activeSeries]);

  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between">
      <div>
        {/* Navigation Masthead */}
        <Navbar
          onOpenGear={() => setIsGearOpen(true)}
          activeSeries={activeSeries}
          onSelectSeries={setActiveSeries}
          seriesList={seriesList}
        />

        {/* Hero & Camera Introduction */}
        <Hero />

        {/* Series and View Controls */}
        <SeriesFilter
          activeSeries={activeSeries}
          onSelectSeries={setActiveSeries}
          seriesList={seriesList}
          layoutMode={layoutMode}
          onToggleLayout={setLayoutMode}
        />

        {/* Dynamic Photo Gallery */}
        <PhotoGrid
          photos={filteredPhotos}
          onOpenPhoto={(photo) => setSelectedPhoto(photo)}
          layoutMode={layoutMode}
        />
      </div>

      {/* Touch & Gesture Enabled Lightbox */}
      <Lightbox
        photo={selectedPhoto}
        photos={filteredPhotos}
        onClose={() => setSelectedPhoto(null)}
        onNavigate={(photo) => setSelectedPhoto(photo)}
      />

      {/* Camera Gear & Philosophy Modal */}
      <GearModal
        isOpen={isGearOpen}
        onClose={() => setIsGearOpen(false)}
      />

      {/* Editorial Minimal Footer */}
      <Footer />
    </div>
  );
}
