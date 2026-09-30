// "Words and order" for a place: what the photo files can't carry. Per-photo facts
// (place, tags, rating) live in the files as keywords; see editorial/README.md.

export interface Chapter {
  id: string;
  /** Display name, in my voice. */
  name: string;
  /** Optional line of text for the chapter. */
  text?: string;
  /** File numbers (DSCF1234) in display order. Membership and order both live here. */
  photos: string[];
}

export interface PlaceCollection {
  /** Matches the site/place/<id> keyword in the files, e.g. "seoul-25". */
  id: string;
  /** Display name of the place. */
  name: string;
  /** The trip this place belongs to (one entry I'd write about). */
  trip: string;
  /** Source folder under ~/Pictures/portfolio-source/. */
  source: string;
  chapters: Chapter[];
  /** Why a frame holds its place despite its stars, keyed by file number. */
  notes?: Record<string, string>;
  /** Good photos that fit no chapter yet; may become an "Around <place>" set later. */
  parked?: { photo: string; note: string }[];
  /** Deliberate drops, recorded so they aren't reconsidered by accident. */
  dropped?: { what: string; note: string }[];
}
