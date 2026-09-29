import type { MetadataRoute } from "next";
import { seriesList, seriesPath } from "@/data/photos";
import { SITE_URL } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return seriesList.map((s) => ({ url: new URL(seriesPath(s.id), SITE_URL).toString() }));
}
