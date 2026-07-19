import { Suspense } from "react";
import { WalkthroughsView } from "@/components/walkthroughs/walkthroughs-view";
import { COLORS } from "@/lib/theme";

export default function WalkthroughsPage() {
  return (
    <Suspense fallback={<div className="px-10 py-9 text-sm" style={{ color: COLORS.muted2 }}>Loading…</div>}>
      <WalkthroughsView />
    </Suspense>
  );
}
