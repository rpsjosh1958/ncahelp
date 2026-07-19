"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useDivisions } from "@/hooks/use-divisions";
import { useLetters } from "@/hooks/use-letters";
import { useOrgChart } from "@/hooks/use-org-chart";
import { useWalkthroughs } from "@/hooks/use-walkthroughs";
import { COLORS } from "@/lib/theme";

const MIN_DISPLAY_MS = 900;
const FADE_MS = 500;

/**
 * Boot splash — also doubles as the initial loading gate. It reads the same
 * TanStack Query hooks the rest of the app uses, so it both warms the cache
 * (no double-fetch flicker once it's gone) and knows exactly when the app is
 * actually ready to show, rather than faking a fixed delay.
 */
export function SplashScreen() {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [removed, setRemoved] = useState(false);
  const startedTimer = useRef(false);

  const { isPending: divisionsPending } = useDivisions();
  const { isPending: walkthroughsPending } = useWalkthroughs();
  const { isPending: lettersPending } = useLetters();
  const { isPending: orgPending } = useOrgChart();
  const dataReady = !divisionsPending && !walkthroughsPending && !lettersPending && !orgPending;

  const shouldHide = minTimeElapsed && dataReady;

  if (removed) return null;

  return (
    <div
      ref={(node) => {
        if (node && !startedTimer.current) {
          startedTimer.current = true;
          setTimeout(() => setMinTimeElapsed(true), MIN_DISPLAY_MS);
        }
      }}
      onTransitionEnd={(e) => {
        if (e.propertyName === "opacity" && shouldHide) setRemoved(true);
      }}
      aria-hidden={shouldHide}
      className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity ease-out"
      style={{
        background: COLORS.contentBg,
        opacity: shouldHide ? 0 : 1,
        pointerEvents: shouldHide ? "none" : "auto",
        transitionDuration: `${FADE_MS}ms`,
      }}
    >
      <Image
        src="/nca-logo.png"
        alt="NCA"
        width={120}
        height={115}
        priority
        style={{ animation: "splashLogoIn 700ms ease-out forwards" }}
      />
    </div>
  );
}
