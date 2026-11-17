// The "look" of a photo: the recipe set in camera before the shot (SOOC), or the RAW
// edit set in Lightroom after it. Looks are the expert path (vault decision "Collections
// are trips, Fujifilm is content"): findable from the lightbox and on their own pages,
// never on thumbnails.

import recipesJson from "./recipes.json";
import looksJson from "./looks.json";
import { photos, type Photo, type RecipeDetails } from "./photos";

export interface Recipe extends RecipeDetails {
  id: string;
  name: string;
  source?: string;
  /** The recipe's own page at its source, for the credit. */
  sourceUrl?: string;
}

/** A RAW edit's develop settings that differ from a fresh import (scripts/looks.mjs). */
export interface EditLook {
  /** The profile it's built on, plus any creative profile over it: "Reala Ace". */
  base: string;
  /** Global sliders in Lightroom's order, values signed: ["Highlights", "−84"]. */
  settings: [string, string][];
  /** Named, not spelled out: "Tone curve", "HSL: orange, blue", "2 masks: sky". */
  more: string[];
}

export const recipes = recipesJson as Recipe[];
const editLooks = looksJson as unknown as Record<string, EditLook>;

/**
 * Recipes with a page so far. Prototype: one page, for the most-used recipe. The full
 * version gives every recipe with enough photos a page.
 */
const RECIPE_PAGES = new Set(["kodak-portra-800-v3"]);

export const recipePages = recipes.filter((r) => RECIPE_PAGES.has(r.id));

export const recipePath = (id: string) => `/recipes/${id}`;

export function findRecipe(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

/** The recipe a camera JPEG was shot with, read from its profile ("Kodak Portra 800 v3 · SOOC"). */
export function recipeOf(photo: Photo): Recipe | undefined {
  if (!photo.recipeDetails || !photo.profile?.endsWith("· SOOC")) return undefined;
  const name = photo.profile.replace(/\s*·\s*SOOC$/, "");
  return recipes.find((r) => r.name === name);
}

export function photosWithRecipe(id: string): Photo[] {
  return photos.filter((p) => recipeOf(p)?.id === id);
}

export function hasRecipePage(recipe: Recipe | undefined): recipe is Recipe {
  return recipe !== undefined && RECIPE_PAGES.has(recipe.id);
}

export type Look =
  | { kind: "recipe"; name: string; recipe?: Recipe; details: RecipeDetails }
  | { kind: "edit"; name: string; edit: EditLook };

/** A photo's look, when the site knows it: every SOOC recipe, and RAW edits in looks.json. */
export function lookOf(photo: Photo): Look | undefined {
  if (photo.recipeDetails) {
    const recipe = recipeOf(photo);
    return {
      kind: "recipe",
      name: recipe?.name ?? photo.recipeDetails.filmSimulation,
      recipe,
      details: photo.recipeDetails,
    };
  }
  const edit = editLooks[photo.id];
  return edit ? { kind: "edit", name: edit.base, edit } : undefined;
}

const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : "0");

/** A recipe as label/value pairs, in the order you'd dial it in; defaults worth skipping are left out. */
export function recipeSettings(recipe: RecipeDetails): [string, string][] {
  const settings: [string, string | undefined][] = [
    ["", recipe.filmSimulation],
    ["", recipe.dynamicRange],
    ["Highlight", recipe.highlight !== undefined ? signed(recipe.highlight) : undefined],
    ["Shadow", recipe.shadow !== undefined ? signed(recipe.shadow) : undefined],
    ["Color", recipe.color !== undefined ? signed(recipe.color) : undefined],
    ["Grain", recipe.grainEffect],
    ["Chrome", recipe.colorChromeEffect],
    ["FX Blue", recipe.colorChromeFXBlue !== "Off" ? recipe.colorChromeFXBlue : undefined],
    ["WB", recipe.whiteBalance],
    ["Clarity", recipe.clarity ? signed(recipe.clarity) : undefined],
    ["NR", recipe.noiseReduction !== undefined ? signed(recipe.noiseReduction) : undefined],
    ["Sharpness", recipe.sharpening !== undefined ? signed(recipe.sharpening) : undefined],
    ["Exp", recipe.exposureCompensation && recipe.exposureCompensation !== "0 EV" ? recipe.exposureCompensation : undefined],
  ];
  return settings.filter((entry): entry is [string, string] => entry[1] !== undefined);
}
