"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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

  // Filtered photos based on active series
  const filteredPhotos = useMemo(() => {
    if (activeSeries === "all") return photos;
    const target = seriesList.find((s) => s.id === activeSeries);
    if (!target) return photos;
    return photos.filter((photo) => photo.series === target.name);
  }, [activeSeries]);

  // Open photo: pushes history entry & updates URL with ?photo=id for shareability
  const handleOpenPhoto = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("photo", photo.id);
      window.history.pushState(
        { lightbox: true, openedFromGrid: true, photoId: photo.id },
        "",
        url.toString()
      );
    }
  }, []);

  // Navigate between photos: replaces history state without cluttering back button stack
  const handleNavigatePhoto = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("photo", photo.id);
      const openedFromGrid = window.history.state?.openedFromGrid ?? false;
      window.history.replaceState(
        { lightbox: true, openedFromGrid, photoId: photo.id },
        "",
        url.toString()
      );
    }
  }, []);

  // Close photo: pops history stack if entered via pushState, or cleans up URL
  const handleClosePhoto = useCallback(() => {
    if (typeof window !== "undefined" && window.history.state?.openedFromGrid) {
      window.history.back();
    } else {
      setSelectedPhoto(null);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("photo");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, []);

  // Handle native browser back/forward buttons & URL sharing (?photo=id)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Initial mount: check if URL contains ?photo=id for direct sharing
    const params = new URLSearchParams(window.location.search);
    const initialPhotoId = params.get("photo");
    if (initialPhotoId) {
      const found = photos.find((p) => p.id === initialPhotoId);
      if (found) {
        setSelectedPhoto(found);
        window.history.replaceState({ lightbox: true, photoId: found.id }, "", window.location.href);
      }
    }

    // 2. Listen to browser Back / Forward events (popstate)
    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const photoId = currentParams.get("photo");
      if (photoId) {
        const target = photos.find((p) => p.id === photoId);
        setSelectedPhoto(target || null);
      } else {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
        <Hero onSelectSeries={setActiveSeries} />

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
          onOpenPhoto={handleOpenPhoto}
          layoutMode={layoutMode}
        />
      </div>

      {/* Touch & Gesture Enabled Lightbox with Browser History Integration */}
      <Lightbox
        photo={selectedPhoto}
        photos={filteredPhotos}
        onClose={handleClosePhoto}
        onNavigate={handleNavigatePhoto}
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
