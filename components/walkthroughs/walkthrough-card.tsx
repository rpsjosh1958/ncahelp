import Link from "next/link";
import type { Division, Walkthrough } from "@/lib/types";
import { COLORS } from "@/lib/theme";

export function WalkthroughCard({ walkthrough, division }: { walkthrough: Walkthrough; division: Division | undefined }) {
  return (
    <Link
      href={`/walkthroughs/${walkthrough.id}`}
      className="flex items-center gap-4 rounded-xl border bg-white px-5 py-4.5 transition-colors"
      style={{ borderColor: COLORS.border }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = COLORS.borderHover;
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(15,36,39,0.07)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.border;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm" style={{ background: division?.color ?? COLORS.faint }} />
          <span className="font-mono text-[10px] tracking-[0.12em]" style={{ color: COLORS.muted3 }}>
            {division?.code}
          </span>
        </div>
        <div className="text-[15.5px] font-bold" style={{ color: COLORS.ink }}>
          {walkthrough.title}
        </div>
        <div className="text-[12.5px] leading-snug" style={{ color: COLORS.muted2 }}>
          {walkthrough.summary}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-mono text-[11px] font-semibold" style={{ color: COLORS.ink2 }}>
          {walkthrough.steps.length} STEPS
        </span>
        <span className="font-mono text-[10.5px]" style={{ color: COLORS.faint }}>
          {walkthrough.duration}
        </span>
      </div>
    </Link>
  );
}
