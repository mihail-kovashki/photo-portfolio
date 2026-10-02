"use client";

import { useState, useMemo, useCallback, useEffect, useSyncExternalStore } from "react";
import { MotionConfig } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SeriesFilter } from "@/components/SeriesFilter";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Lightbox } from "@/components/Lightbox";
import { GearModal } from "@/components/GearModal";
import { TripIndex } from "@/components/TripIndex";
import { Footer } from "@/components/Footer";
import {
  photos,
  photosInSeries,
  chaptersFor,
  findSeries,
  seriesPath,
  ALL_SERIES_ID,
  type Photo,
} from "@/data/photos";
import { collectionTitle } from "@/data/site";
import { captureMorphOrigin } from "@/lib/photoMorph";
import { preferredScrollBehavior } from "@/lib/utils";

// The active collection (/prague-26) and the open photo (?photo=id) live in the URL,
// so shared links, reloads and the browser's back/forward buttons all agree.
// pushState/replaceState don't fire popstate, so our own URL changes announce
// themselves with this event. Next.js syncs its router with both calls.
const URL_CHANGE_EVENT = "gallery-url-change";

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

const getSeriesFromPath = () => {
  const segment = window.location.pathname.split("/").filter(Boolean)[0];
  return segment && findSeries(segment) ? segment : ALL_SERIES_ID;
};

function updateUrl(url: URL, mode: "push" | "replace", state: object) {
  if (mode === "push") window.history.pushState(state, "", url.toString());
  else window.history.replaceState(state, "", url.toString());
  window.dispatchEvent(new Event(URL_CHANGE_EVENT));
}

function setPhotoParam(photoId: string | null, mode: "push" | "replace", state: object) {
  const url = new URL(window.location.href);
  if (photoId) url.searchParams.set("photo", photoId);
  else url.searchParams.delete("photo");
  updateUrl(url, mode, state);
}

interface GalleryProps {
  /** The collection this page was rendered for; the URL takes over after hydration. */
  initialSeries: string;
}

export function Gallery({ initialSeries }: GalleryProps) {
  const activeSeries = useSyncExternalStore(subscribeToUrl, getSeriesFromPath, () => initialSeries);
  const [layoutMode, setLayoutMode] = useState<"masonry" | "story">("masonry");
  const [isGearOpen, setIsGearOpen] = useState(false);
  const [isTripsOpen, setIsTripsOpen] = useState(false);

  const selectedPhotoId = useSyncExternalStore(subscribeToUrl, getPhotoParam, getServerPhotoParam);
  const selectedPhoto = useMemo(
    () => photos.find((p) => p.id === selectedPhotoId) ?? null,
    [selectedPhotoId]
  );

  const filteredPhotos = useMemo(() => photosInSeries(activeSeries), [activeSeries]);
  const chapters = useMemo(() => chaptersFor(activeSeries), [activeSeries]);

  // Each collection is its own page (/prague-26): switching pushes a history entry
  const handleSelectSeries = useCallback((seriesId: string) => {
    const url = new URL(seriesPath(seriesId), window.location.origin);
    if (url.pathname === window.location.pathname) return;
    updateUrl(url, "push", {});
  }, []);

  // From the trip index: a new place starts at its first photos, wherever the page was
  const handleSelectTripPlace = useCallback(
    (seriesId: string) => {
      handleSelectSeries(seriesId);
      requestAnimationFrame(() => {
        document.getElementById("gallery")?.scrollIntoView({ behavior: preferredScrollBehavior() });
      });
    },
    [handleSelectSeries]
  );

  // Metadata only sets the title on load; keep it in step with in-page switches
  useEffect(() => {
    document.title = collectionTitle(activeSeries);
  }, [activeSeries]);

  // A shared or back-navigated photo may sit outside the active filter; browse all then
  const lightboxPhotos =
    selectedPhoto && !filteredPhotos.includes(selectedPhoto) ? photos : filteredPhotos;

  // Open photo: pushes a history entry so Back closes the lightbox
  const handleOpenPhoto = useCallback((photo: Photo) => {
    captureMorphOrigin(photo.id);
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

  // reducedMotion="user": with the OS "reduce motion" setting on, Framer Motion skips
  // movement (slides, springs, scale) and keeps simple fades
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between">
        <div>
          {/* Navigation Masthead */}
          <Navbar
            onOpenGear={() => setIsGearOpen(true)}
            activeSeries={activeSeries}
            onSelectSeries={handleSelectSeries}
            onOpenTrips={() => setIsTripsOpen(true)}
          />

          {/* Hero & Camera Introduction */}
          <Hero onSelectSeries={handleSelectSeries} />

          {/* Series and View Controls */}
          <SeriesFilter
            activeSeries={activeSeries}
            onSelectSeries={handleSelectSeries}
            onOpenTrips={() => setIsTripsOpen(true)}
            layoutMode={layoutMode}
            onToggleLayout={setLayoutMode}
          />

          {/* Dynamic Photo Gallery */}
          <PhotoGrid
            photos={filteredPhotos}
            chapters={chapters}
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

        {/* Every trip and place, grouped by year */}
        <TripIndex
          isOpen={isTripsOpen}
          onClose={() => setIsTripsOpen(false)}
          activeSeries={activeSeries}
          onSelectSeries={handleSelectTripPlace}
        />

        {/* Editorial Minimal Footer */}
        <Footer />
      </div>
    </MotionConfig>
  );
}
