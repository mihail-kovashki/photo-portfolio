"use client";

import { createContext, useContext } from "react";
import type { Photo } from "@/data/photos";

// What the home page's sections can ask of the page around them

export interface HomeActions {
  /** Opens a photo in the lightbox, browsing `list`. Morphs from its [data-photo-thumb]. */
  openPhoto: (photo: Photo, list: Photo[]) => void;
  /** Opens the index of every trip. */
  openTrips: () => void;
}

export const HomeActionsContext = createContext<HomeActions>({ openPhoto: () => {}, openTrips: () => {} });

export const useHomeActions = () => useContext(HomeActionsContext);
