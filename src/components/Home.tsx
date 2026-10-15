"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Intro } from "@/components/Intro";
import { HomeTrips } from "@/components/HomeTrips";
import { Lightbox } from "@/components/Lightbox";
import { GearModal } from "@/components/GearModal";
import { TripIndex } from "@/components/TripIndex";
import { Footer } from "@/components/Footer";
import { photos, seriesPath, type Photo } from "@/data/photos";
import { captureMorphOrigin } from "@/lib/photoMorph";
import { useHistorySheet, useClearStaleSheetEntry } from "@/lib/dialog";
import { HomeActionsContext } from "@/lib/homeActions";

// The home page. Its own route, around the same header, sheets and lightbox as the
// collection pages. The open photo lives in the URL (?photo=id) as it does there, so
// Back closes it, and links shared before the home page existed still open the photo.

const URL_CHANGE_EVENT = "home-url-change";

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

export function Home() {
  const router = useRouter();
  const [isGearOpen, setIsGearOpen] = useState(false);
  const [isTripsOpen, setIsTripsOpen] = useState(false);
  // The frames the open photo was opened among; a shared link browses every photo
  const [browsing, setBrowsing] = useState<Photo[] | null>(null);
  useClearStaleSheetEntry();
  const tripsSheet = useHistorySheet(isTripsOpen, () => setIsTripsOpen(false));

  const selectedPhotoId = useSyncExternalStore(subscribeToUrl, getPhotoParam, getServerPhotoParam);
  const selectedPhoto = useMemo(() => photos.find((p) => p.id === selectedPhotoId) ?? null, [selectedPhotoId]);
  const lightboxPhotos = selectedPhoto && browsing?.includes(selectedPhoto) ? browsing : photos;

  const openTrips = useCallback(() => {
    setIsTripsOpen(true);
    tripsSheet.open();
  }, [tripsSheet]);

  // Pushes a history entry so Back closes the lightbox
  const openPhoto = useCallback((photo: Photo, list: Photo[]) => {
    captureMorphOrigin(photo.id);
    setBrowsing(list);
    setPhotoParam(photo.id, "push", { lightbox: true, openedFromGrid: true });
  }, []);

  const navigatePhoto = useCallback((photo: Photo) => {
    const openedFromGrid = window.history.state?.openedFromGrid ?? false;
    setPhotoParam(photo.id, "replace", { lightbox: true, openedFromGrid });
  }, []);

  const closePhoto = useCallback(() => {
    if (window.history.state?.openedFromGrid) window.history.back();
    else setPhotoParam(null, "replace", {});
  }, []);

  const goTo = useCallback((seriesId: string) => router.push(seriesPath(seriesId)), [router]);

  const actions = useMemo(() => ({ openPhoto, openTrips }), [openPhoto, openTrips]);

  return (
    <MotionConfig reducedMotion="user">
      <HomeActionsContext.Provider value={actions}>
        <div className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between">
          <div>
            <Navbar onOpenGear={() => setIsGearOpen(true)} onSelectSeries={goTo} onOpenTrips={openTrips} />

            {/* Opening animation, once per session; it parts onto the cover */}
            <Intro />

            <main>
              <HomeTrips />
            </main>
          </div>

          <Lightbox photo={selectedPhoto} photos={lightboxPhotos} onClose={closePhoto} onNavigate={navigatePhoto} />
          <GearModal isOpen={isGearOpen} onClose={() => setIsGearOpen(false)} />
          <TripIndex isOpen={isTripsOpen} onClose={tripsSheet.close} activeSeries="" onSelectSeries={goTo} />
          <Footer />
        </div>
      </HomeActionsContext.Provider>
    </MotionConfig>
  );
}
