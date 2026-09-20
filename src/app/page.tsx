"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SeriesFilter } from "@/components/SeriesFilter";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Lightbox } from "@/components/Lightbox";
import { GearModal } from "@/components/GearModal";
import { Footer } from "@/components/Footer";
import { photos, filmRecipes, type Photo } from "@/data/photos";

export default function Home() {
  const [activeSeries, setActiveSeries] = useState<string>("all");
  const [activeRecipe, setActiveRecipe] = useState<string>("all");
  const [layoutMode, setLayoutMode] = useState<"masonry" | "story">("masonry");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isGearOpen, setIsGearOpen] = useState(false);

  // Series Counts
  const counts = useMemo(() => {
    return {
      all: photos.length,
      hokkaido: photos.filter((p) => p.series === "Hokkaido 2025").length,
      korea: photos.filter((p) => p.series === "Korea 2025").length,
    };
  }, []);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Filter by series
      if (activeSeries === "hokkaido" && photo.series !== "Hokkaido 2025") {
        return false;
      }
      if (activeSeries === "korea" && photo.series !== "Korea 2025") {
        return false;
      }

      // Filter by film recipe
      if (activeRecipe !== "all" && photo.filmRecipe !== activeRecipe) {
        return false;
      }

      return true;
    });
  }, [activeSeries, activeRecipe]);

  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between">
      <div>
        {/* Navigation Masthead */}
        <Navbar
          onOpenGear={() => setIsGearOpen(true)}
          activeSeries={activeSeries}
          onSelectSeries={(seriesId) => {
            setActiveSeries(seriesId);
          }}
        />

        {/* Hero & Camera Introduction */}
        <Hero />

        {/* Series and View Controls */}
        <SeriesFilter
          activeSeries={activeSeries}
          onSelectSeries={setActiveSeries}
          activeRecipe={activeRecipe}
          onSelectRecipe={setActiveRecipe}
          recipes={filmRecipes}
          counts={counts}
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
