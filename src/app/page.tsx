"use client";

import { useState, useMemo, useCallback, useSyncExternalStore } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SeriesFilter } from "@/components/SeriesFilter";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Lightbox } from "@/components/Lightbox";
import { GearModal } from "@/components/GearModal";
import { Footer } from "@/components/Footer";
import { photos, seriesList, type Photo } from "@/data/photos";

// The open photo lives in the URL (?photo=id), so shared links, reloads and the
// browser's back/forward buttons all agree. pushState/replaceState don't fire
// popstate, so our own URL changes announce themselves with this event.
const URL_CHANGE_EVENT = "photo-url-change";

function subscribeToUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(URL_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(URL_CHANGE_EVENT, onChange);
  };
}

const getPhotoParam = () => new URLSearchParams(window.location.search).get("photo");
const getServerPhotoParam = () => null;

function setPhotoParam(photoId: string | null, mode: "push" | "replace", state: object) {
  const url = new URL(window.location.href);
  if (photoId) url.searchParams.set("photo", photoId);
  else url.searchParams.delete("photo");
  if (mode === "push") window.history.pushState(state, "", url.toString());
  else window.history.replaceState(state, "", url.toString());
  window.dispatchEvent(new Event(URL_CHANGE_EVENT));
}

export default function Home() {
  const [activeSeries, setActiveSeries] = useState<string>("all");
  const [layoutMode, setLayoutMode] = useState<"masonry" | "story">("masonry");
  const [isGearOpen, setIsGearOpen] = useState(false);

  const selectedPhotoId = useSyncExternalStore(subscribeToUrl, getPhotoParam, getServerPhotoParam);
  const selectedPhoto = useMemo(
    () => photos.find((p) => p.id === selectedPhotoId) ?? null,
    [selectedPhotoId]
  );

  // Filtered photos based on active series
  const filteredPhotos = useMemo(() => {
    if (activeSeries === "all") return photos;
    const target = seriesList.find((s) => s.id === activeSeries);
    if (!target) return photos;
    return photos.filter((photo) => photo.series === target.name);
  }, [activeSeries]);

  // A shared or back-navigated photo may sit outside the active filter; browse all then
  const lightboxPhotos =
    selectedPhoto && !filteredPhotos.includes(selectedPhoto) ? photos : filteredPhotos;

  // Open photo: pushes a history entry so Back closes the lightbox
  const handleOpenPhoto = useCallback((photo: Photo) => {
    setPhotoParam(photo.id, "push", { lightbox: true, openedFromGrid: true });
  }, []);

  // Navigate between photos: replaces history state without cluttering back button stack
  const handleNavigatePhoto = useCallback((photo: Photo) => {
    const openedFromGrid = window.history.state?.openedFromGrid ?? false;
    setPhotoParam(photo.id, "replace", { lightbox: true, openedFromGrid });
  }, []);

  // Close photo: pops history stack if entered via pushState, or cleans up URL
  const handleClosePhoto = useCallback(() => {
    if (window.history.state?.openedFromGrid) {
      window.history.back();
    } else {
      setPhotoParam(null, "replace", {});
    }
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
        photos={lightboxPhotos}
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
