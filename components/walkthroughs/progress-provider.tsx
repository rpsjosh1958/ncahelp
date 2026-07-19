"use client";

import { createContext, useContext, useState } from "react";

interface ProgressContextValue {
  isChecked: (walkthroughId: string, stepIndex: number) => boolean;
  toggle: (walkthroughId: string, stepIndex: number) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function key(walkthroughId: string, stepIndex: number): string {
  return `${walkthroughId}-${stepIndex}`;
}

export function WalkthroughProgressProvider({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const value: ProgressContextValue = {
    isChecked: (walkthroughId, stepIndex) => !!checked[key(walkthroughId, stepIndex)],
    toggle: (walkthroughId, stepIndex) =>
      setChecked((prev) => ({ ...prev, [key(walkthroughId, stepIndex)]: !prev[key(walkthroughId, stepIndex)] })),
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useWalkthroughProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useWalkthroughProgress must be used within a WalkthroughProgressProvider");
  return ctx;
}
