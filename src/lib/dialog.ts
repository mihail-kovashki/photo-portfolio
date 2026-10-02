"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { animate, useDragControls, useMotionValue, type PanInfo } from "framer-motion";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Locks page scroll while a dialog is open, compensating for the scrollbar width so
 * the page behind doesn't shift, and restores the exact scroll position on close.
 * A layout effect: removing the scrollbar widens the viewport, so it must happen
 * before anything in the dialog is measured (the photo morph) or painted.
 */
export function useBodyScrollLock(active: boolean) {
  useLayoutEffect(() => {
    if (!active) return;

    const scrollY = window.scrollY;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;

      const prevBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({ top: scrollY, behavior: "instant" });
      document.documentElement.style.scrollBehavior = prevBehavior;
    };
  }, [active]);
}

/**
 * Moves focus into a dialog when it opens (to the element marked `data-autofocus`,
 * or the first focusable one), keeps Tab cycling inside it, and returns focus to
 * whatever was focused before once it closes.
 */
export function useDialogFocus(containerRef: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Visible elements only: the HUD renders compact and expanded variants and hides one.
    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0
      );

    const initial = container.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0] ?? container;
    initial.focus({ preventScroll: true });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const elements = focusables();
      if (elements.length === 0) {
        e.preventDefault();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      const current = document.activeElement;
      if (!container.contains(current)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [containerRef, active]);
}

/**
 * Gives a sheet its own history entry while it's open, so Back (and the back gesture on
 * phones) closes the sheet instead of leaving the page. Call `open` as the sheet opens
 * and close only through `close`, which steps back out of the entry and runs `then`
 * once it's gone; that's the moment to navigate or scroll.
 */
export function useHistorySheet(isOpen: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  const thenRef = useRef<(() => void) | null>(null);
  // Marks this opening's entry, so a sheet only counts its own entry as "still open"
  const keyRef = useRef("");
  const restorationRef = useRef<ScrollRestoration>("auto");
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  const open = useCallback(() => {
    // Leaving the entry would otherwise restore the scroll position it was opened at
    restorationRef.current = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    keyRef.current = `${Date.now()}-${Math.random()}`;
    window.history.pushState({ ...window.history.state, sheet: keyRef.current }, "", window.location.href);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handlePopState = () => {
      if (window.history.state?.sheet === keyRef.current) return;
      window.history.scrollRestoration = restorationRef.current;
      onCloseRef.current();
      const then = thenRef.current;
      thenRef.current = null;
      then?.();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen]);

  const close = useCallback((then?: () => void) => {
    if (keyRef.current && window.history.state?.sheet === keyRef.current) {
      thenRef.current = then ?? null;
      window.history.back();
    } else {
      onCloseRef.current();
      then?.();
    }
  }, []);

  return { open, close };
}

/**
 * A reload while a sheet is open keeps its entry's marker though the sheet is gone.
 * Clears it on page load. Called once, by the page.
 */
export function useClearStaleSheetEntry() {
  useEffect(() => {
    const state = window.history.state;
    if (state?.sheet) window.history.replaceState({ ...state, sheet: undefined }, "", window.location.href);
  }, []);
}

const SWIPE_CLOSE_DISTANCE = 100;
const SWIPE_CLOSE_VELOCITY = 500;

const SWIPE_EXIT = { duration: 0.2, ease: "easeIn" } as const;

/**
 * Swipe down to close a bottom sheet, from its handle area only so the list inside
 * still scrolls. Phones only (below sm), where the sheet is a bottom sheet. Spread
 * `sheetProps` on the motion element and `handleProps` on the handle area, and use
 * `exit` (when set) in place of the sheet's usual exit.
 */
export function useSwipeToClose(isOpen: boolean, close: () => void) {
  const controls = useDragControls();
  const y = useMotionValue(0);
  const [swiped, setSwiped] = useState(false);
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setSwiped(false);
  }

  const sheetProps = {
    style: { y },
    drag: "y" as const,
    dragControls: controls,
    dragListener: false,
    dragConstraints: { top: 0, bottom: 0 },
    dragElastic: { top: 0, bottom: 1 },
    onDragEnd: (_: unknown, info: PanInfo) => {
      if (info.offset.y < SWIPE_CLOSE_DISTANCE && info.velocity.y < SWIPE_CLOSE_VELOCITY) return;
      // Carry on down from where the finger let go. Left alone, the drag springs the
      // sheet back to full height while the close waits on history, and it flashes.
      setSwiped(true);
      animate(y, window.innerHeight, SWIPE_EXIT);
      close();
    },
  };
  const exit = swiped ? { y: window.innerHeight, transition: SWIPE_EXIT } : undefined;
  const handleProps = {
    onPointerDown: (e: React.PointerEvent) => {
      if (window.matchMedia("(min-width: 640px)").matches) return;
      if ((e.target as HTMLElement).closest("button")) return;
      controls.start(e);
    },
    style: { touchAction: "none" } as React.CSSProperties,
  };
  return { sheetProps, handleProps, exit };
}
