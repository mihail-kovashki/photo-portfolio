"use client";

// The opening animation: plays once per browser session, on the home page only, and
// never under reduced motion. An inline script in the layout decides before the first
// paint and marks <html data-intro="play">, so the intro covers the page from the very
// first frame instead of flashing the page and then covering it. Add ?intro to the URL
// to see it again in the same session.
//
// Markup contract: the intro's root carries .intro-root, which CSS shows only while
// <html data-intro="play">.

import { useSyncExternalStore } from "react";
import { photos, type Photo } from "@/data/photos";

const SEEN_KEY = "intro-seen";

/** Runs in <head>, before the page is painted. Kept small and dependency-free. */
export const INTRO_SCRIPT = `(function(){try{var l=location,q=new URLSearchParams(l.search);if(l.pathname!=="/"||q.has("photo"))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(!q.has("intro")&&sessionStorage.getItem("${SEEN_KEY}"))return;sessionStorage.setItem("${SEEN_KEY}","1");document.documentElement.dataset.intro="play";history.scrollRestoration="manual";}catch(e){}})()`;

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

const isPlaying = () => document.documentElement.dataset.intro === "play";

/** Whether the intro is playing. False on the server, so hydration always matches. */
export function useIntroPlaying() {
  return useSyncExternalStore(subscribe, isPlaying, () => false);
}

/** Hands the page over: hides the intro for the rest of the visit. */
export function endIntro() {
  delete document.documentElement.dataset.intro;
  listeners.forEach((l) => l());
}

/** The best frames (5★), in display order. */
export const featuredPhotos: Photo[] = photos.filter((p) => p.featured);
