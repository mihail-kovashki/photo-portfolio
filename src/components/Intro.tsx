"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
import { photos, type Photo } from "@/data/photos";
import { useIntroPlaying, endIntro, featuredPhotos } from "@/lib/intro";
import { preferredScrollBehavior } from "@/lib/utils";

// Photo wall: the first screen is a faint wall of the best frames with a welcome line.
// Scrolling drives it, at the visitor's pace: the frames part outwards from the centre
// and fade, the hero slides up from below, and once the wall has passed it is removed
// so the rest of the visit is the ordinary page. Nothing blocks; any scroll goes through.

// Where each frame hangs, as the centre of the frame in % of the screen, and its width
// in vmax so the wall fills portrait phones and wide screens alike
const SLOTS = [
  { x: 14, y: 16, w: 17 },
  { x: 38, y: 9, w: 13 },
  { x: 63, y: 14, w: 16 },
  { x: 88, y: 20, w: 15 },
  { x: 6, y: 48, w: 12 },
  { x: 26, y: 44, w: 15 },
  { x: 76, y: 46, w: 14 },
  { x: 96, y: 56, w: 12 },
  { x: 16, y: 80, w: 16 },
  { x: 42, y: 88, w: 14 },
  { x: 62, y: 82, w: 17 },
  { x: 88, y: 86, w: 14 },
];

// The best frames first, then the 4★ ones, one place at a time so the wall shows range
function wallPhotos(): Photo[] {
  const strong = [...featuredPhotos, ...photos.filter((p) => !p.featured && (p.rating ?? 0) >= 4)];
  const picked: Photo[] = [];
  const perPlace = new Map<string, number>();
  for (const p of strong) {
    const n = perPlace.get(p.series) ?? 0;
    if (n >= 2) continue;
    perPlace.set(p.series, n + 1);
    picked.push(p);
    if (picked.length === SLOTS.length) break;
  }
  return picked;
}

const WALL = wallPhotos();

function WallFrame({ photo, slot, index, progress }: { photo: Photo; slot: (typeof SLOTS)[number]; index: number; progress: MotionValue<number> }) {
  // Part away from the centre: the further out a frame hangs, the further it travels
  const dx = (slot.x - 50) * 1.6;
  const dy = (slot.y - 50) * 1.6;
  const x = useTransform(progress, [0, 1], ["0vw", `${dx}vw`]);
  const y = useTransform(progress, [0, 1], ["0vh", `${dy}vh`]);
  const scale = useTransform(progress, [0, 1], [1, 1.5]);
  const opacity = useTransform(progress, [0, 0.15, 0.75], [0.42, 0.55, 0]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        width: `${slot.w}vmax`,
        aspectRatio: photo.aspectRatio,
        translate: "-50% -50%",
        x,
        y,
        scale,
        opacity,
      }}
    >
      <motion.img
        src={photo.thumbUrl}
        alt=""
        decoding="async"
        initial={{ opacity: 0, filter: "blur(12px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, delay: 0.15 + index * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
        className="w-full h-full object-cover rounded-lg"
      />
    </motion.div>
  );
}

export function Intro() {
  const playing = useIntroPlaying();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // The section is 160svh with a sticky screen inside, so the screen holds still for the
  // first 60svh of scrolling (progress 0 to 0.375) and then scrolls away with the page.
  // The welcome line leaves first, then the wall parts, all while the screen holds.
  const textOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.1], ["0vh", "-6vh"]);
  const wallProgress = useTransform(scrollYProgress, [0.02, 0.36], [0, 1]);

  // Past the wall: remove it and take its height off the scroll position in the same
  // frame, so the page doesn't move under the visitor
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 1 || !ref.current) return;
    const height = ref.current.offsetHeight;
    endIntro();
    window.scrollTo({ top: Math.max(0, window.scrollY - height), behavior: "instant" });
  });

  const enter = () => {
    if (!ref.current) return;
    window.scrollTo({ top: ref.current.offsetHeight, behavior: preferredScrollBehavior() });
  };

  return (
    <section ref={ref} aria-label="Welcome" className="intro-root relative h-[160svh]">
      {playing && (
        <div className="sticky top-0 h-svh overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0">
            {WALL.map((photo, i) => (
              <WallFrame key={photo.id} photo={photo} slot={SLOTS[i]} index={i} progress={wallProgress} />
            ))}
            {/* Keep the centre dark enough to read the welcome over */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(9,9,11,0.9)_0%,rgba(9,9,11,0.55)_40%,rgba(9,9,11,0.05)_100%)]" />
          </div>

          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-4"
            >
              Mihail Kovashki · Photographs
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-tight text-white leading-[1.05]"
            >
              Come <span className="italic">wander</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="mt-5 text-sm text-zinc-300/90 font-light max-w-sm"
            >
              Visual notes from {new Set(photos.map((p) => p.series)).size} places, one trip at a time.
            </motion.p>

            <motion.button
              type="button"
              onClick={enter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors rounded-lg px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Scroll to enter
              <span className="relative block h-10 w-px overflow-hidden bg-white/10">
                <span className="intro-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-white/70" />
              </span>
            </motion.button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
