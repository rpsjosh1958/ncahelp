"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useWalkthroughProgress } from "@/components/walkthroughs/progress-provider";
import { useDivision } from "@/hooks/use-divisions";
import { useWalkthrough } from "@/hooks/use-walkthroughs";
import { COLORS } from "@/lib/theme";

export default function WalkthroughDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: walkthrough, isPending } = useWalkthrough(id);
  const { data: division } = useDivision(walkthrough?.division);
  const { isChecked, toggle } = useWalkthroughProgress();

  if (isPending) {
    return <div className="px-10 py-9 text-sm" style={{ color: COLORS.muted2 }}>Loading…</div>;
  }
  if (!walkthrough) {
    return <div className="px-10 py-9 text-sm" style={{ color: COLORS.muted2 }}>Walkthrough not found.</div>;
  }

  const checkedCount = walkthrough.steps.filter((_, i) => isChecked(walkthrough.id, i)).length;
  const pct = Math.round((checkedCount / walkthrough.steps.length) * 100);

  return (
    <div className="mx-auto flex max-w-[820px] flex-col gap-5.5 px-4 py-6 pb-12 sm:px-6 md:px-10 md:py-8">
      <Link
        href="/walkthroughs"
        className="flex w-fit items-center gap-1.5 font-mono text-[11px] tracking-[0.1em]"
        style={{ color: COLORS.muted3 }}
      >
        <ArrowLeft className="h-3.5 w-3.5" /> WALKTHROUGHS
      </Link>

      <header className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <span
            className="rounded-full px-2.5 py-1 font-mono text-[10.5px] font-semibold tracking-[0.1em]"
            style={{ background: `${division?.color ?? COLORS.faint}22`, color: division?.color ?? COLORS.faint }}
          >
            {division?.name.toUpperCase()}
          </span>
          <span className="font-mono text-[11px]" style={{ color: COLORS.faint }}>
            {walkthrough.duration}
            <span className="hidden sm:inline"> · UPDATED {walkthrough.updated}</span>
          </span>
        </div>
        <h1 className="text-[27px] font-extrabold leading-tight tracking-tight" style={{ color: COLORS.ink }}>
          {walkthrough.title}
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: COLORS.muted }}>
          {walkthrough.summary}
        </p>
      </header>

      <div className="flex items-center gap-3.5">
        <div className="h-[5px] flex-1 overflow-hidden rounded-full" style={{ background: COLORS.border }}>
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{ width: `${pct}%`, background: COLORS.accent }}
          />
        </div>
        <span className="font-mono text-[11.5px]" style={{ color: COLORS.muted3 }}>
          {checkedCount} / {walkthrough.steps.length} DONE
        </span>
      </div>

      <ol className="flex list-none flex-col gap-2.5 p-0">
        {walkthrough.steps.map((step, i) => {
          const checked = isChecked(walkthrough.id, i);
          return (
            <li
              key={step.title}
              className="flex gap-4 rounded-xl border bg-white px-4.5 py-4"
              style={{ borderColor: checked ? COLORS.accentTint : COLORS.border, opacity: checked ? 0.65 : 1 }}
            >
              <button
                type="button"
                onClick={() => toggle(walkthrough.id, i)}
                className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-2 p-0 font-mono text-xs font-bold"
                style={{
                  borderColor: checked ? COLORS.accent : COLORS.borderHover,
                  background: checked ? COLORS.accent : "transparent",
                  color: checked ? "#FFFFFF" : COLORS.ink,
                }}
              >
                {checked ? "✓" : i + 1}
              </button>
              <div className="flex flex-col gap-1">
                <div
                  className="text-[14.5px] font-bold"
                  style={{ color: COLORS.ink, textDecoration: checked ? "line-through" : "none" }}
                >
                  {step.title}
                </div>
                <div className="text-[13px] leading-relaxed" style={{ color: COLORS.muted2 }}>
                  {step.detail}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
