import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
