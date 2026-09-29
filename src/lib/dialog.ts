"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";

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
