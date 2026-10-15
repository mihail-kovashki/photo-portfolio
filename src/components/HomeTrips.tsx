"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { chaptersFor, type Photo } from "@/data/photos";
import {
  placeForPhoto,
  siteStats,
  tripSummaries,
  latestTrip,
  homeCover,
  COVER_STATEMENTS,
  type PlaceSummary,
  type TripSummary,
} from "@/data/home";
import { useHomeActions } from "@/lib/homeActions";

// The home page below the opening wall: the latest trip as a full-screen cover, then
// every trip as the same unit repeated (name and numbers, a large cover, its places as
// small covers, each place's chapters as a quiet line), so trip → place → chapter is
// learnt by looking. Ends with the way to every photo.

const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#09090b]";

const listNames = (names: string[]) =>
  names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

const statementFor = (t: TripSummary) =>
  COVER_STATEMENTS[t.id] || `${t.count} photographs from ${listNames(t.places.map((p) => p.name))}.`;

const seasonYear = (t: TripSummary) => [t.season, t.year].filter(Boolean).join(" ");

/** The chapter a photo sits in, for captions. */
function chapterOf(photo: Photo) {
  const place = placeForPhoto(photo);
  if (!place) return undefined;
  const chapter = chaptersFor(place.id)?.find((c) => c.photos.some((p) => p.id === photo.id));
  return { place, chapter: chapter ? place.chapters.find((c) => c.id === chapter.id) : undefined };
}

const latest = latestTrip;
const hero = homeCover;
const heroWhere = chapterOf(hero);

// Each section's large cover is the trip's cover, except where that is already the hero
function sectionCover(t: TripSummary): Photo {
  if (t.cover.id !== hero.id) return t.cover;
  return t.frames.find((f) => f.id !== hero.id && f.aspectRatio > 1) ?? t.frames.find((f) => f.id !== hero.id) ?? t.cover;
}

function Cover() {
  const { openTrips } = useHomeActions();
  const firstPlace = latest.places[0];
  // Rising from under the opening wall, the cover's top edge would cut across the rows
  // as a hard line. A dark fade on that edge clears as the cover reaches the top of the
  // screen, so the photo comes up out of the dark. Without the wall the cover already
  // sits at the top and the fade is clear from the start.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "start start"] });
  const riseFade = useTransform(scrollYProgress, [0.45, 1], [1, 0]);
  return (
    <section
      ref={sectionRef}
      aria-labelledby="cover-title"
      className="relative h-[100svh] min-h-[340px] w-full overflow-hidden bg-zinc-950"
    >
      {/* A touch left of centre on phones held upright, where most of a landscape is cropped */}
      <Image
        src={hero.displayUrl}
        alt={hero.title || heroWhere?.place.name || hero.placeName}
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={hero.blurDataUrl}
        className="object-cover object-[40%_50%] sm:object-center"
      />
      <motion.div
        aria-hidden
        style={{ opacity: riseFade }}
        className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-[#09090b] via-[#09090b]/70 to-transparent pointer-events-none"
      />
      {/* Scrims: a thin one behind the header, and one pooled behind the type only */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
      <div aria-hidden className="sm:hidden absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#09090b]/85 via-[#09090b]/40 to-transparent" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 0% 100%, rgba(9,9,11,0.82) 0%, rgba(9,9,11,0.5) 38%, rgba(9,9,11,0) 70%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-14 [@media(max-height:500px)]:pb-5 flex items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] sm:text-xs text-zinc-300">
              {seasonYear(latest)} · {latest.places.map((p) => p.name).join(" · ")}
            </p>
            <h1
              id="cover-title"
              className="mt-2 font-serif text-6xl sm:text-8xl [@media(max-height:500px)]:text-5xl tracking-tight leading-[0.95] text-white"
            >
              {latest.name}
            </h1>
            <p className="mt-4 [@media(max-height:500px)]:mt-2 max-w-md text-sm sm:text-base leading-relaxed text-zinc-300 [@media(max-height:500px)]:hidden">
              {statementFor(latest)}
            </p>
            <div className="mt-6 [@media(max-height:500px)]:mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href={firstPlace.href}
                className={`${FOCUS} inline-flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950 hover:bg-white transition-colors`}
              >
                View the trip <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <button
                type="button"
                onClick={openTrips}
                className={`${FOCUS} rounded-sm text-sm text-zinc-300 underline decoration-zinc-500 underline-offset-4 hover:text-white hover:decoration-white transition-colors`}
              >
                or browse every trip
              </button>
            </div>
          </div>
          {heroWhere && (
            <p className="hidden md:block shrink-0 pb-1 text-right font-mono text-[11px] text-zinc-300/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
              {heroWhere.chapter ? (
                <Link href={heroWhere.chapter.href} className={`${FOCUS} rounded-sm hover:text-white`}>
                  {heroWhere.place.name} · {heroWhere.chapter.name}
                </Link>
              ) : (
                heroWhere.place.name
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/** A place's cover, unless it is already the section's large cover: then another of its frames. */
function placeCover(place: PlaceSummary, trip: TripSummary, avoid: Photo): Photo {
  if (place.cover.id !== avoid.id) return place.cover;
  const inPlace = (p: Photo) => placeForPhoto(p)?.id === place.id;
  return (
    trip.frames.find((f) => f.id !== avoid.id && inPlace(f)) ??
    place.chapters.map((c) => c.cover).find((c) => c.id !== avoid.id) ??
    place.cover
  );
}

function PlaceCard({ place, cover }: { place: PlaceSummary; cover: Photo }) {
  return (
    <li>
      <Link href={place.href} className={`${FOCUS} group block rounded-lg`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-zinc-900 transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-1">
          <Image
            src={cover.thumbUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 45vw, 200px"
            placeholder="blur"
            blurDataURL={cover.blurDataUrl}
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
        <p className="mt-2 font-serif text-[15px] sm:text-lg leading-tight text-zinc-100 group-hover:text-white">{place.name}</p>
        <p className="mt-0.5 font-mono text-[11px] text-zinc-500">{place.count} photos</p>
      </Link>
    </li>
  );
}

/** A trip with a single place: the place beside its chapters, listed in full. */
function SolePlace({ place, cover }: { place: PlaceSummary; cover: Photo }) {
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-5 sm:gap-8 items-start">
      <ul>
        <PlaceCard place={place} cover={cover} />
      </ul>
      {place.chapters.length > 0 && (
        <div>
          <h4 className="font-mono text-[11px] text-zinc-500">{place.chapters.length} chapters</h4>
          <ol className="mt-3 border-t border-white/10">
            {place.chapters.map((c) => (
              <li key={c.id} className="border-b border-white/10">
                <Link
                  href={c.href}
                  className={`${FOCUS} group flex items-baseline justify-between gap-4 rounded-sm py-2.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors`}
                >
                  <span>{c.name}</span>
                  <span className="font-mono text-[11px] text-zinc-600 group-hover:text-zinc-400 tabular-nums">{c.count}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function ChapterLines({ trip }: { trip: TripSummary }) {
  const withChapters = trip.places.filter((p) => p.chapters.length > 0);
  if (withChapters.length === 0) return null;
  const limit = 3;
  return (
    <div className="mt-8 border-t border-white/10 pt-5">
      <h4 className="sr-only">Chapters</h4>
      <ul className="space-y-2.5">
        {withChapters.map((place) => {
          const shown = place.chapters.slice(0, limit);
          const more = place.chapters.length - shown.length;
          return (
            <li key={place.id} className="text-sm leading-relaxed">
              {trip.places.length > 1 && <span className="font-serif text-zinc-300 mr-2">{place.name}</span>}
              {shown.map((c, i) => (
                <span key={c.id}>
                  {i > 0 && <span aria-hidden className="text-zinc-700 mx-1.5">·</span>}
                  <Link
                    href={c.href}
                    className={`${FOCUS} rounded-sm text-zinc-500 hover:text-zinc-100 underline-offset-4 hover:underline transition-colors`}
                  >
                    {c.name}
                  </Link>
                </span>
              ))}
              {more > 0 && (
                <>
                  <span aria-hidden className="text-zinc-700 mx-1.5">·</span>
                  <Link
                    href={place.href}
                    className={`${FOCUS} rounded-sm font-mono text-[11px] text-zinc-600 hover:text-zinc-200 transition-colors`}
                    aria-label={`${more} more chapters in ${place.name}`}
                  >
                    +{more} more
                  </Link>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TripSection({ trip, index }: { trip: TripSummary; index: number }) {
  const { openPhoto } = useHomeActions();
  const cover = sectionCover(trip);
  const wide = cover.aspectRatio > 1;
  const flip = index % 2 === 1;
  // Place covers stay small beside the large cover: rows of 3, or 4 beside an upright
  const n = trip.places.length;
  const placeCols =
    n === 2 ? "grid-cols-2 sm:grid-cols-3" : n === 4 ? (wide ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4") : "grid-cols-3";
  const headingId = `trip-${trip.id}`;
  const list = trip.frames.includes(cover) ? trip.frames : [cover, ...trip.frames];

  return (
    <section aria-labelledby={headingId} className="w-full max-w-7xl mx-auto px-4 sm:px-6">
      <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-white/10 pb-4 mb-6 sm:mb-8">
        <span className="font-mono text-[11px] text-zinc-600 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        <h3 id={headingId} className="font-serif text-3xl sm:text-5xl tracking-tight text-zinc-100">
          <Link href={trip.places[0].href} className={`${FOCUS} rounded-sm hover:text-white`}>
            {trip.name}
          </Link>
        </h3>
        <p className="font-mono text-[11px] sm:text-xs text-zinc-500">
          {seasonYear(trip)} · {trip.places.length} {trip.places.length === 1 ? "place" : "places"} · {trip.count} photos
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className={`${wide ? "lg:col-span-7" : "lg:col-span-5"} ${flip ? "lg:order-2" : ""}`}>
          <button
            type="button"
            onClick={() => openPhoto(cover, list)}
            data-photo-thumb={cover.id}
            aria-label={`Open ${trip.name}'s best frames`}
            className={`${FOCUS} relative block w-full overflow-hidden rounded-xl bg-zinc-900 cursor-zoom-in ${
              wide ? "" : "mx-auto"
            }`}
            style={
              wide
                ? { aspectRatio: cover.aspectRatio }
                : // Uprights are held to the screen's height, so a phone on its side sees them whole
                  { aspectRatio: Math.max(cover.aspectRatio, 4 / 5), maxWidth: `min(30rem, calc((100svh - 6rem) * ${Math.max(cover.aspectRatio, 4 / 5)}))` }
            }
          >
            <Image
              src={cover.displayUrl}
              alt={cover.title || cover.placeName}
              fill
              sizes={wide ? "(max-width: 1024px) 100vw, 740px" : "(max-width: 1024px) 100vw, 520px"}
              placeholder="blur"
              blurDataURL={cover.blurDataUrl}
              className="object-cover"
            />
          </button>
        </div>

        <div className={`${wide ? "lg:col-span-5" : "lg:col-span-7"} ${flip ? "lg:order-1" : ""} lg:pt-1`}>
          <h4 className="sr-only">Places</h4>
          {n === 1 ? (
            <SolePlace place={trip.places[0]} cover={placeCover(trip.places[0], trip, cover)} />
          ) : (
            <>
              <ul className={`grid ${placeCols} gap-x-4 gap-y-6`}>
                {trip.places.map((p) => (
                  <PlaceCard key={p.id} place={p} cover={placeCover(p, trip, cover)} />
                ))}
              </ul>
              <ChapterLines trip={trip} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export function HomeTrips() {
  const { openTrips } = useHomeActions();
  return (
    <div>
      <Cover />

      <div className="pt-20 sm:pt-28">
        <h2 className="sr-only">Every trip</h2>
        <div className="flex flex-col gap-24 sm:gap-36">
          {tripSummaries.map((t, i) => (
            <TripSection key={t.id} trip={t} index={i} />
          ))}
        </div>
      </div>

      <section aria-label="Everything else" className="max-w-7xl mx-auto px-4 sm:px-6 mt-28 sm:mt-40 mb-24">
        <div className="border-t border-white/10 pt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <Link
              href="/all"
              className={`${FOCUS} group inline-flex items-baseline gap-3 rounded-sm font-serif text-4xl sm:text-5xl tracking-tight text-zinc-100 hover:text-white`}
            >
              All {siteStats.photos} photos
              <ArrowRight className="w-6 h-6 self-center text-zinc-500 group-hover:text-white transition-colors" aria-hidden />
            </Link>
            <p className="mt-2 font-mono text-[11px] text-zinc-500">
              {siteStats.trips} trips · {siteStats.places} places · {siteStats.chapters} chapters · {siteStats.firstYear}–
              {siteStats.lastYear}
            </p>
          </div>
          <button
            type="button"
            onClick={openTrips}
            className={`${FOCUS} self-start sm:self-auto inline-flex items-center gap-2 glass-pill rounded-full px-5 py-2.5 text-sm text-zinc-200 hover:bg-white/10 transition-colors`}
          >
            Every trip and place <ArrowRight className="w-4 h-4" aria-hidden />
          </button>
        </div>
      </section>
    </div>
  );
}
