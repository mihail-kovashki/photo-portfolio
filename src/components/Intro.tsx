"use client";

import { useRef, useSyncExternalStore } from "react";
import {
  motion,
  animate,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
  type AnimationPlaybackControls,
} from "framer-motion";
import { photos, type Photo } from "@/data/photos";
import { useIntroPlaying, endIntro, featuredPhotos } from "@/lib/intro";

// Photo wall: the first screen is a wall of the best frames, hung in unbroken rows that
// run off both edges of the screen like strips of film, with the welcome over a fade in
// the middle. Scrolling drives it, at the visitor's pace: the rows slide apart in
// alternating directions while the page rises into view behind them. "Enter" plays the
// same transition for anyone who'd rather not scroll. Once the wall has passed it is
// removed, so the rest of the visit is the ordinary page.

interface Row {
  count: number;
  /** Which way the row slides out, and its resting offset in vw so frames don't line up. */
  dir: -1 | 1;
  offset: number;
  /** Up, down or neither as it leaves. */
  vdir: -1 | 0 | 1;
}

interface Layout {
  /** Row height and the gap between rows and frames, in svh. */
  rowHeight: number;
  gap: number;
  rows: Row[];
  /** Keeps the welcome readable: dark behind the text only, clear well before the edges. */
  scrim: string;
}

// Laptops, desktops and tablets: three rows of large frames
const WIDE: Layout = {
  rowHeight: 26,
  gap: 2.4,
  rows: [
    { count: 9, dir: -1, offset: -7, vdir: -1 },
    { count: 9, dir: 1, offset: 2, vdir: 0 },
    { count: 9, dir: -1, offset: 7, vdir: 1 },
  ],
  scrim:
    "radial-gradient(ellipse 34% 28% at 50% 50%, rgba(9,9,11,0.9) 0%, rgba(9,9,11,0.72) 40%, rgba(9,9,11,0.3) 72%, rgba(9,9,11,0) 100%)",
};

// Phones held upright: five rows fill the screen, the welcome on a band across the middle
const TALL: Layout = {
  rowHeight: 18.4,
  gap: 1.2,
  rows: [
    { count: 5, dir: -1, offset: -18, vdir: -1 },
    { count: 5, dir: 1, offset: 12, vdir: -1 },
    { count: 5, dir: -1, offset: -6, vdir: 0 },
    { count: 5, dir: 1, offset: 16, vdir: 1 },
    { count: 5, dir: -1, offset: -10, vdir: 1 },
  ],
  scrim:
    "linear-gradient(to bottom, rgba(9,9,11,0) 0%, rgba(9,9,11,0) 20%, rgba(9,9,11,0.5) 30%, rgba(9,9,11,0.86) 37%, rgba(9,9,11,0.86) 63%, rgba(9,9,11,0.5) 70%, rgba(9,9,11,0) 80%, rgba(9,9,11,0) 100%)",
};

// Phones on their side: like the wide wall, in shorter rows
const SHORT: Layout = {
  rowHeight: 29,
  gap: 2,
  rows: [
    { count: 9, dir: -1, offset: -7, vdir: -1 },
    { count: 9, dir: 1, offset: 2, vdir: 0 },
    { count: 9, dir: -1, offset: 7, vdir: 1 },
  ],
  scrim:
    "radial-gradient(ellipse 34% 38% at 50% 50%, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.75) 40%, rgba(9,9,11,0.3) 72%, rgba(9,9,11,0) 100%)",
};

const TALL_QUERY = "(max-width: 767px) and (orientation: portrait)";
const SHORT_QUERY = "(max-height: 500px) and (orientation: landscape)";

function subscribeToLayout(onChange: () => void) {
  const queries = [TALL_QUERY, SHORT_QUERY].map((q) => window.matchMedia(q));
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}

const getLayoutName = () =>
  window.matchMedia(TALL_QUERY).matches ? "tall" : window.matchMedia(SHORT_QUERY).matches ? "short" : "wide";

const LAYOUTS = { wide: WIDE, tall: TALL, short: SHORT };

// The best frames first, then the 4★ ones, at most two per place so the wall shows range
function candidates(): Photo[] {
  const perPlace = new Map<string, number>();
  return [...featuredPhotos, ...photos.filter((p) => !p.featured && (p.rating ?? 0) >= 4)].filter((p) => {
    const n = perPlace.get(p.series) ?? 0;
    perPlace.set(p.series, n + 1);
    return n < 2;
  });
}

/**
 * Hands out photos so the strongest land where they're most visible, the middle of each
 * row, since rows run off both edges. Rows take turns, so the best frames spread over
 * the whole wall.
 */
function fill(layout: Layout): Photo[][] {
  const pool = candidates();
  const filled = layout.rows.map((row) => Array<Photo>(row.count));
  const centreOut = (count: number) => {
    const mid = Math.floor(count / 2);
    const order = [mid];
    for (let d = 1; order.length < count; d++) {
      if (mid - d >= 0) order.push(mid - d);
      if (mid + d < count) order.push(mid + d);
    }
    return order;
  };
  let next = 0;
  const longest = Math.max(...layout.rows.map((r) => r.count));
  for (let level = 0; level < longest; level++) {
    layout.rows.forEach((row, r) => {
      if (level < row.count) filled[r][centreOut(row.count)[level]] = pool[next++ % pool.length];
    });
  }
  return filled;
}

const FILLED = { wide: fill(WIDE), tall: fill(TALL), short: fill(SHORT) };

// The section is 120svh with a sticky screen inside, so the screen holds still for the
// first 20svh of scrolling (progress 0 to 0.17), just long enough for the welcome to
// leave, then scrolls away as the page rises. The rows keep sliding apart and fading
// over the rising page, so the two cross-fade instead of passing through black.
const SECTION_HEIGHT = "120svh";
const TEXT_OUT: [number, number] = [0, 0.1];
const WALL_RANGE: [number, number] = [0.02, 0.7];
const WALL_OPACITY = 0.85;

// "Enter": the same transition, played for the visitor
const ENTER_DURATION = 1.3;
const ENTER_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

function Frame({ photo, delay }: { photo: Photo; delay: number }) {
  return (
    <div className="relative h-full shrink-0 overflow-hidden rounded-lg" style={{ aspectRatio: photo.aspectRatio }}>
      <motion.img
        src={photo.thumbUrl}
        alt=""
        decoding="async"
        initial={{ opacity: 0, filter: "blur(12px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.1, delay, ease: [0.2, 0.8, 0.2, 1] }}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

interface WallRowProps {
  row: Row;
  frames: Photo[];
  index: number;
  layout: Layout;
  progress: MotionValue<number>;
}

function WallRow({ row, frames, index, layout, progress }: WallRowProps) {
  const top = `calc(50% + ${(index - (layout.rows.length - 1) / 2) * (layout.rowHeight + layout.gap) - layout.rowHeight / 2}svh)`;
  const gap = `${layout.gap}svh`;

  // Leaving: each row slides sideways, and the outer ones away from the middle
  const x = useTransform(progress, [0, 1], [`${row.offset}vw`, `${row.offset + row.dir * 38}vw`]);
  const y = useTransform(progress, [0, 1], ["0vh", `${row.vdir * 14}vh`]);
  const opacity = useTransform(progress, [0, 0.85], [WALL_OPACITY, 0]);
  const filter = useTransform(progress, [0.2, 0.85], ["blur(0px)", "blur(3px)"]);

  // Arriving: the row slides in a little from the side it will leave by, and its
  // frames develop from the middle outwards
  const centre = Math.floor(frames.length / 2);
  return (
    <motion.div className="absolute inset-x-0" style={{ top, height: `${layout.rowHeight}svh`, x, y, opacity, filter }}>
      <motion.div
        className="flex h-full justify-center"
        style={{ gap }}
        initial={{ opacity: 0, x: row.dir * 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.1 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        {frames.map((photo, i) => (
          <Frame key={photo.id} photo={photo} delay={0.2 + index * 0.08 + Math.abs(i - centre) * 0.07} />
        ))}
      </motion.div>
    </motion.div>
  );
}

export function Intro() {
  const playing = useIntroPlaying();
  const layoutName = useSyncExternalStore(subscribeToLayout, getLayoutName, () => "wide" as const);
  const layout = LAYOUTS[layoutName];
  const wall = FILLED[layoutName];

  const ref = useRef<HTMLElement>(null);
  const entering = useRef<AnimationPlaybackControls | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const textOpacity = useTransform(scrollYProgress, TEXT_OUT, [1, 0]);
  const textY = useTransform(scrollYProgress, TEXT_OUT, ["0vh", "-6vh"]);
  const wallProgress = useTransform(scrollYProgress, WALL_RANGE, [0, 1]);

  // Past the wall: remove it and take its height off the scroll position in the same
  // frame, so the page doesn't move under the visitor
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 1 || !ref.current) return;
    const height = ref.current.offsetHeight;
    entering.current?.stop();
    endIntro();
    window.scrollTo({ top: Math.max(0, window.scrollY - height), behavior: "instant" });
  });

  // Scrolls through the wall on a fixed curve rather than the browser's smooth scroll,
  // so it plays the same everywhere. Scrolling, dragging or a key takes back control.
  const enter = () => {
    if (!ref.current || entering.current) return;
    const target = ref.current.offsetTop + ref.current.offsetHeight;
    const takeBack = () => entering.current?.stop();
    const events = ["wheel", "touchmove", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, takeBack, { once: true, passive: true }));
    entering.current = animate(window.scrollY, target, {
      duration: ENTER_DURATION,
      ease: ENTER_EASE,
      onUpdate: (top) => window.scrollTo({ top, behavior: "instant" }),
      onComplete: () => {
        entering.current = null;
        events.forEach((e) => window.removeEventListener(e, takeBack));
      },
      onStop: () => {
        entering.current = null;
        events.forEach((e) => window.removeEventListener(e, takeBack));
      },
    });
  };

  return (
    <section ref={ref} aria-label="Welcome" className="intro-root relative" style={{ height: SECTION_HEIGHT }}>
      {playing && (
        // Clipped sideways only: rows sliding down pass behind the rising page instead
        // of being cut off at the screen's bottom edge
        <div className="sticky top-0 h-svh overflow-x-clip">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            {layout.rows.map((row, i) => (
              <WallRow
                key={`${layoutName}-${i}`}
                row={row}
                frames={wall[i]}
                index={i}
                layout={layout}
                progress={wallProgress}
              />
            ))}
            {/* Keep the welcome readable, and the header over the top row */}
            <div className="absolute inset-0" style={{ background: layout.scrim }} />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#09090b]/75 to-transparent" />
          </div>

          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-4 [@media(max-height:500px)]:hidden"
            >
              Mihail Kovashki · Photographs
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-5xl sm:text-7xl md:text-8xl [@media(max-height:500px)]:text-5xl tracking-tight text-white leading-[1.05]"
            >
              Come <span className="italic">wander</span>
            </motion.h2>

            <motion.button
              type="button"
              onClick={enter}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="glass-pill mt-8 [@media(max-height:500px)]:mt-4 rounded-full px-6 py-2.5 text-sm text-zinc-100 hover:bg-white/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Enter
            </motion.button>

            {/* The slower way in: a hint, not a control (Enter is the control). Dropped,
                with the label, on phones held sideways, where there is no room for them */}
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-5 [@media(max-height:500px)]:hidden flex flex-col items-center gap-3 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400"
            >
              or scroll to explore
              <span className="relative block h-8 w-px overflow-hidden bg-white/10">
                <span className="intro-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-white/70" />
              </span>
            </motion.span>
          </motion.div>

        </div>
      )}
    </section>
  );
}
