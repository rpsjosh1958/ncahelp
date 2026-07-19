import { COLORS } from "@/lib/theme";

/** Simple CSS-only hover tooltip (no JS state) — shown to the right of `children`. */
export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group/tooltip relative flex">
      {children}
      <div
        className="pointer-events-none absolute left-full top-1/2 z-50 ml-2.5 -translate-y-1/2 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold opacity-0 transition-opacity delay-150 duration-150 group-hover/tooltip:opacity-100"
        style={{ background: COLORS.ink, color: COLORS.contentBg, boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}
      >
        {label}
        <span
          className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent"
          style={{ borderRightColor: COLORS.ink }}
        />
      </div>
    </div>
  );
}
