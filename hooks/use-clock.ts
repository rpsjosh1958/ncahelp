"use client";

import { useSyncExternalStore } from "react";

// Cached outside the render — getSnapshot must return the same value on
// every call until the store actually changes, or React's dev-mode
// consistency check (which calls getSnapshot twice per render) sees two
// different Date.now() readings and assumes it's unstable, warning/looping.
let cachedNow = Date.now();

function subscribe(callback: () => void) {
  const id = setInterval(() => {
    cachedNow = Date.now();
    callback();
  }, 1000);
  return () => clearInterval(id);
}

function getSnapshot() {
  return cachedNow;
}

function getServerSnapshot() {
  // Fixed value for the server-rendered/pre-hydration pass; React re-renders
  // with the real client snapshot immediately after hydration, so this never
  // shows on screen — it just avoids a hydration mismatch warning.
  return 0;
}

/** Live-ticking clock, subscribed via useSyncExternalStore instead of useEffect. */
export function useClock(): Date {
  const ms = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return new Date(ms);
}
