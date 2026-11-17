import type { MetadataRoute } from "next";
import { seriesList, seriesPath } from "@/data/photos";
import { SITE_URL } from "@/data/site";
import { recipePages, recipePath } from "@/data/looks";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...seriesList.map((s) => seriesPath(s.id)), ...recipePages.map((r) => recipePath(r.id))].map((path) => ({ url: new URL(path, SITE_URL).toString() }));
}
