/**
 * Formats an ISO date string (e.g. "2026-07-02" or "2025-09-28") into an evocative Season + Year string,
 * such as "Summer 2026" or "Autumn 2025".
 */
export function formatSeasonYear(dateStr?: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  const year = parts[0];
  const month = parseInt(parts[1], 10);
  if (!month || !year) return dateStr;

  // Northern hemisphere meteorological seasons:
  // Mar, Apr, May = Spring
  // Jun, Jul, Aug = Summer
  // Sep, Oct, Nov = Autumn
  // Dec, Jan, Feb = Winter
  let season = "Winter";
  if (month >= 3 && month <= 5) season = "Spring";
  else if (month >= 6 && month <= 8) season = "Summer";
  else if (month >= 9 && month <= 11) season = "Autumn";

  return `${season} ${year}`;
}

interface ExposureFields {
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
}

/** "FUJINON XF70-300mmF4-5.6 R LM OIS WR" -> "XF70-300mmF4-5.6" */
export function shortLensName(lens?: string): string | undefined {
  return lens
    ?.replace(/^FUJINON\s+/i, "")
    .replace(/\s+R\s+LM\s+OIS\s+WR$/i, "")
    .replace(/\s+R\s+LM\s+WR$/i, "")
    .replace(/\s+R\s+WR$/i, "");
}

/** Focal length, or the lens name when EXIF has no focal length. */
export function focalOrLens(photo: ExposureFields): string | undefined {
  return photo.focalLength || photo.lens?.replace(/^FUJINON\s+/i, "");
}

/** "ƒ/5.6 · 1/250s · ISO 500", skipping values EXIF didn't have. */
export function exposureSummary(photo: ExposureFields): string {
  return [photo.aperture, photo.shutterSpeed, photo.iso].filter(Boolean).join(" · ");
}

/** "smooth" unless the visitor has asked the OS to reduce motion. */
export function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}
