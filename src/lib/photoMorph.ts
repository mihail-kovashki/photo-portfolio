"use client";

// Thumbnail <-> lightbox morph. A temporary <img> flies between the grid thumbnail
// and the lightbox image, so the photo appears to lift out of the grid and settle
// back into it. It's imperative on purpose: the lightbox already animates zoom, pan
// and slides with Framer Motion, and a layout animation would fight those. It uses
// the Web Animations API directly because Framer's standalone animate() silently
// skips position changes under reduced motion, and this module decides that itself.
//
// Markup contract: the grid frame carries data-photo-thumb="<id>" (with an <img>
// inside), and the lightbox image carries data-lightbox-image="<id>".

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const FLIGHT: KeyframeAnimationOptions = {
  duration: 420,
  easing: "cubic-bezier(0.2, 0.9, 0.25, 1)",
  fill: "forwards",
};
const LIGHTBOX_RADIUS = 8;

let pendingOrigin: { photoId: string; rect: Rect; radius: number; src: string } | null = null;
let finishActive: (() => void) | null = null;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const thumbFor = (photoId: string) =>
  document.querySelector<HTMLElement>(`[data-photo-thumb="${CSS.escape(photoId)}"]`);

const lightboxImageFor = (photoId: string) =>
  document.querySelector<HTMLImageElement>(`img[data-lightbox-image="${CSS.escape(photoId)}"]`);

function toRect(r: DOMRect): Rect {
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

function isOnScreen(r: Rect) {
  return r.width > 0 && r.top < window.innerHeight && r.top + r.height > 0;
}

// The lightbox <img> is object-contain inside a larger box; find the visible picture
function containedRect(img: HTMLImageElement, aspectRatio: number): Rect {
  const box = img.getBoundingClientRect();
  const width = Math.min(box.width, box.height * aspectRatio);
  const height = width / aspectRatio;
  return {
    left: box.left + (box.width - width) / 2,
    top: box.top + (box.height - height) / 2,
    width,
    height,
  };
}

const px = (r: Rect): Keyframe => ({
  left: `${r.left}px`,
  top: `${r.top}px`,
  width: `${r.width}px`,
  height: `${r.height}px`,
});

// Viewport rect -> page rect, for a flyer that should scroll along with the page
function toPage(r: Rect): Rect {
  return { ...r, left: r.left + window.scrollX, top: r.top + window.scrollY };
}

function createFlyer(src: string, rect: Rect, radius: number, position: "fixed" | "absolute" = "fixed") {
  const el = document.createElement("img");
  el.src = src;
  el.alt = "";
  el.setAttribute("aria-hidden", "true");
  Object.assign(el.style, {
    position,
    margin: "0",
    objectFit: "cover",
    borderRadius: `${radius}px`,
    zIndex: "60",
    pointerEvents: "none",
    ...px(rect),
  });
  document.body.appendChild(el);
  return el;
}

/** Call when a thumbnail is activated, before the lightbox opens. */
export function captureMorphOrigin(photoId: string) {
  pendingOrigin = null;
  if (prefersReducedMotion()) return;
  const thumb = thumbFor(photoId);
  const img = thumb?.querySelector("img");
  if (!thumb || !img) return;
  const rect = toRect(thumb.getBoundingClientRect());
  if (!isOnScreen(rect)) return;
  pendingOrigin = {
    photoId,
    rect,
    radius: parseFloat(getComputedStyle(thumb).borderTopLeftRadius) || 0,
    src: img.currentSrc || img.src,
  };
}

/** Call once the lightbox has rendered its image; a no-op unless the photo was opened from the grid. */
export function morphIntoLightbox(photoId: string, aspectRatio: number) {
  const origin = pendingOrigin;
  pendingOrigin = null;
  finishActive?.();
  if (!origin || origin.photoId !== photoId) return;

  const target = lightboxImageFor(photoId);
  if (!target) return;
  const thumb = thumbFor(photoId);
  const flyer = createFlyer(origin.src, origin.rect, origin.radius);

  target.style.opacity = "0";
  if (thumb) thumb.style.visibility = "hidden";

  const flight = flyer.animate(
    [
      { ...px(origin.rect), borderRadius: `${origin.radius}px` },
      { ...px(containedRect(target, aspectRatio)), borderRadius: `${LIGHTBOX_RADIUS}px` },
    ],
    FLIGHT
  );
  // The flyer is the already-loaded thumbnail; hand over once the full image is ready
  const loaded = target.complete && target.naturalWidth > 0 ? Promise.resolve() : target.decode().catch(() => {});

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    flight.cancel();
    flyer.remove();
    target.style.opacity = "";
    if (thumb) thumb.style.visibility = "";
    if (finishActive === finish) finishActive = null;
  };
  finishActive = finish;

  Promise.all([flight.finished, loaded]).then(() => {
    if (done) return;
    // Show the full image underneath at once and fade only the flyer on top. Fading
    // both at the same time dips through the dark backdrop and reads as a blink.
    target.style.opacity = "";
    flyer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-out", fill: "forwards" })
      .finished.then(finish, finish);
  }, finish); // finished rejects when a flight is cancelled mid-way
}

/** Call after the lightbox closed on this photo; returns it to its thumbnail if that is on screen. */
export function morphIntoGrid(photoId: string, aspectRatio: number) {
  finishActive?.();
  if (prefersReducedMotion()) return;

  const source = lightboxImageFor(photoId);
  const thumb = thumbFor(photoId);
  if (!source || !thumb) return;
  const destination = toRect(thumb.getBoundingClientRect());
  if (!isOnScreen(destination)) return;

  // Page scrolling is unlocked again, so fly in page coordinates: if the visitor
  // scrolls mid-flight, the flyer moves with the grid and still lands on its thumbnail
  const start = toPage(containedRect(source, aspectRatio));
  const flyer = createFlyer(source.currentSrc || source.src, start, LIGHTBOX_RADIUS, "absolute");
  source.style.opacity = "0";
  thumb.style.visibility = "hidden";

  const flight = flyer.animate(
    [
      { ...px(start), borderRadius: `${LIGHTBOX_RADIUS}px` },
      { ...px(toPage(destination)), borderRadius: getComputedStyle(thumb).borderTopLeftRadius },
    ],
    FLIGHT
  );

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    flight.cancel();
    flyer.remove();
    thumb.style.visibility = "";
    if (finishActive === finish) finishActive = null;
  };
  finishActive = finish;
  flight.finished.then(finish, finish);
}
