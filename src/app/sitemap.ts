import type { MetadataRoute } from "next";
import { seriesList, seriesPath } from "@/data/photos";
import { SITE_URL } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...seriesList.map((s) => seriesPath(s.id))].map((path) => ({ url: new URL(path, SITE_URL).toString() }));
}
