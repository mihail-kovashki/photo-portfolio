import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import {
  seriesList,
  findSeries,
  photosInSeries,
  coverPhoto,
  seriesPath,
  ALL_SERIES_ID,
} from "@/data/photos";
import { collectionTitle, SITE_DESCRIPTION } from "@/data/site";
import { formatSeasonYear } from "@/lib/utils";

// "/" shows everything, "/prague-26" one collection. All pages are pre-rendered;
// any other path is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { series: [] },
    ...seriesList.filter((s) => s.id !== ALL_SERIES_ID).map((s) => ({ series: [s.id] })),
  ];
}

type Params = Promise<{ series?: string[] }>;

async function resolveSeriesId(params: Params): Promise<string> {
  const { series = [] } = await params;
  if (series.length === 0) return ALL_SERIES_ID;
  if (series.length > 1 || !findSeries(series[0])) notFound();
  return series[0];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const seriesId = await resolveSeriesId(params);
  const series = findSeries(seriesId);
  const list = photosInSeries(seriesId);
  const cover = coverPhoto(list);
  const title = collectionTitle(seriesId);

  const seasons = [...new Set(list.map((p) => formatSeasonYear(p.dateTaken)).filter(Boolean))];
  const description =
    seriesId === ALL_SERIES_ID || !series
      ? SITE_DESCRIPTION
      : `${list.length} photographs: ${series.name}${seasons.length === 1 ? `, ${seasons[0]}` : ""}.`;

  return {
    title,
    description,
    alternates: { canonical: seriesPath(seriesId) },
    openGraph: {
      title,
      description,
      type: "website",
      url: seriesPath(seriesId),
      images: cover
        ? [{ url: cover.displayUrl, width: cover.width, height: cover.height, alt: title }]
        : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CollectionPage({ params }: { params: Params }) {
  const seriesId = await resolveSeriesId(params);
  return <Gallery initialSeries={seriesId} />;
}
