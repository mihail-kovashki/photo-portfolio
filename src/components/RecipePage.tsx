"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Lightbox } from "@/components/Lightbox";
import { GearModal } from "@/components/GearModal";
import { TripIndex } from "@/components/TripIndex";
import { Footer } from "@/components/Footer";
import { RecipeDials } from "@/components/RecipeDials";
import {
  photosInSeries,
  findPlaceItem,
  placeContext,
  seriesPath,
  type Photo,
  type ResolvedChapter,
} from "@/data/photos";
import { findRecipe, recipeOf } from "@/data/looks";
import { captureMorphOrigin } from "@/lib/photoMorph";
import { useHistorySheet, useClearStaleSheetEntry } from "@/lib/dialog";

// A recipe's page: the settings drawn as dials, where it came from, and every photo shot
// with it, grouped by the place it was shot in, in each place's own order. The open
// photo lives in the URL (?photo=id) as on the other pages, so Back closes it.

const URL_CHANGE_EVENT = "recipe-url-change";

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

/** The recipe's photos as one chapter per place, places in the order they were shot. */
function chaptersFor(recipeId: string, list: Photo[]): ResolvedChapter[] {
  const placeIds = [...new Set(list.map((p) => p.place ?? ""))].filter(Boolean);
  return placeIds
    .map((placeId) => {
      const place = findPlaceItem(placeId);
      const photos = photosInSeries(placeId).filter((p) => recipeOf(p)?.id === recipeId);
      return { chapter: { id: placeId, name: place?.place ?? placeId, text: placeContext(placeId), photos }, startDate: place?.startDate ?? "" };
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .map(({ chapter }) => chapter);
}

export function RecipePage({ recipeId }: { recipeId: string }) {
  const recipe = findRecipe(recipeId)!;
  const router = useRouter();
  const [isGearOpen, setIsGearOpen] = useState(false);
  const [isTripsOpen, setIsTripsOpen] = useState(false);
  useClearStaleSheetEntry();
  const tripsSheet = useHistorySheet(isTripsOpen, () => setIsTripsOpen(false));
  const openTrips = useCallback(() => {
    setIsTripsOpen(true);
    tripsSheet.open();
  }, [tripsSheet]);

  const chapters = useMemo(() => {
    const all = photosInSeries("all").filter((p) => recipeOf(p)?.id === recipeId);
    return chaptersFor(recipeId, all);
  }, [recipeId]);
  const list = useMemo(() => chapters.flatMap((c) => c.photos), [chapters]);

  const selectedPhotoId = useSyncExternalStore(subscribeToUrl, getPhotoParam, getServerPhotoParam);
  const selectedPhoto = useMemo(() => list.find((p) => p.id === selectedPhotoId) ?? null, [list, selectedPhotoId]);

  const openPhoto = useCallback((photo: Photo) => {
    captureMorphOrigin(photo.id);
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

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between">
        <div>
          {/* "all" lights nothing in the header: a recipe is neither home nor a trip */}
          <Navbar onOpenGear={() => setIsGearOpen(true)} activeSeries="all" onSelectSeries={goTo} onOpenTrips={openTrips} />

          <main>
            <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-8 sm:pb-10">
              <p className="font-mono text-xs text-zinc-500">
                Fujifilm recipe · {recipe.filmSimulation} · {list.length} photos
              </p>
              <h1 className="mt-2 font-serif text-4xl sm:text-6xl tracking-tight text-white">{recipe.name}</h1>
              <p className="mt-4 max-w-2xl text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
                A look set in the camera before the shot, not in an edit afterwards. Every photo below
                is the JPEG straight out of my X-T5 with these settings.
              </p>
            </header>

            {/* The recipe itself */}
            <section aria-labelledby="recipe-settings" className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
              <h2 id="recipe-settings" className="sr-only">Settings</h2>
              <RecipeDials recipe={recipe} />
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-zinc-400">
                {recipe.sourceUrl ? (
                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-200 underline decoration-white/30 underline-offset-4 hover:decoration-white"
                  >
                    Recipe by {recipe.source}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  recipe.source && <span>Recipe by {recipe.source}</span>
                )}
                <span className="font-mono text-xs text-zinc-500">
                  Exposure varies by scene: see each photo&apos;s details
                </span>
              </div>
            </section>

            {/* Where it was used, as a way into the journal */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-10 border-t border-white/10 pt-8 sm:pt-10">
              <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-zinc-100">Shot with it</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {chapters.map((c) => (
                  <Link
                    key={c.id}
                    href={seriesPath(c.id)}
                    className="relative tap inline-flex items-center gap-2 px-3.5 py-1.5 pointer-coarse:py-2.5 rounded-full border border-white/20 bg-white/5 text-sm text-zinc-200 hover:text-white hover:border-white/40 transition-colors"
                  >
                    {c.name}
                    <span className="font-mono text-xs text-zinc-500">{c.photos.length}</span>
                  </Link>
                ))}
              </div>
            </section>

            <PhotoGrid photos={list} chapters={chapters} onOpenPhoto={openPhoto} layoutMode="masonry" />
          </main>
        </div>

        <Lightbox photo={selectedPhoto} photos={list} onClose={closePhoto} onNavigate={navigatePhoto} />
        <GearModal isOpen={isGearOpen} onClose={() => setIsGearOpen(false)} />
        <TripIndex isOpen={isTripsOpen} onClose={tripsSheet.close} activeSeries="" onSelectSeries={goTo} />
        <Footer />
      </div>
    </MotionConfig>
  );
}
