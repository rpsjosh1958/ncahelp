"use client";

import { useRef, useState } from "react";
import { COLORS } from "@/lib/theme";

const VISIBLE_MS = 3000;
const FADE_MS = 400;

/** A one-time nudge bubble near the chat FAB — shows briefly, then fades away on its own (or on click/open). */
export function ChatTeaser({ onOpen }: { onOpen: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [removed, setRemoved] = useState(false);
  const startedTimer = useRef(false);

  if (removed) return null;

  return (
    <button
      type="button"
      onClick={() => {
        onOpen();
        setFadeOut(true);
      }}
      ref={(node) => {
        if (node && !startedTimer.current) {
          startedTimer.current = true;
          setTimeout(() => setFadeOut(true), VISIBLE_MS);
        }
      }}
      onTransitionEnd={(e) => {
        if (e.propertyName === "opacity" && fadeOut) setRemoved(true);
      }}
      aria-hidden={fadeOut}
      className="fixed bottom-[92px] right-5 z-40 rounded-2xl px-4 py-2.5 text-left shadow-lg transition-opacity ease-out"
      style={{
        background: COLORS.sidebarBg,
        color: COLORS.sidebarFg,
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "auto",
        transitionDuration: `${FADE_MS}ms`,
      }}
    >
      <span className="text-[13px] font-semibold">Ask the assistant</span>
      <span
        className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45"
        style={{ background: COLORS.sidebarBg }}
      />
    </button>
  );
}
