import Link from "next/link";
import type { Division, LetterTemplate, OrgPerson } from "@/lib/types";
import { COLORS } from "@/lib/theme";

function initials(name: string | undefined): string {
  return (name ?? "")
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .slice(-2)
    .map((w) => w[0])
    .join("");
}

export function LetterCard({
  letter,
  division,
  approver,
}: {
  letter: LetterTemplate;
  division: Division | undefined;
  approver: OrgPerson | undefined;
}) {
  return (
    <Link
      href={`/letters/${letter.id}`}
      className="flex flex-col gap-2.5 rounded-xl border bg-white p-5 transition-shadow"
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
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-sm" style={{ background: division?.color ?? COLORS.faint }} />
        <span className="font-mono text-[10px] tracking-[0.1em]" style={{ color: COLORS.muted3 }}>
          {letter.refFormat}
        </span>
      </div>
      <div className="text-[15px] font-bold" style={{ color: COLORS.ink }}>
        {letter.title}
      </div>
      <div className="flex-1 text-[12.5px] leading-snug" style={{ color: COLORS.muted2 }}>
        {letter.description}
      </div>
      <div className="flex items-center gap-1.5 border-t pt-2.5" style={{ borderColor: COLORS.border2 }}>
        <span
          className="flex h-[22px] w-[22px] items-center justify-center rounded-full font-mono text-[9.5px] font-bold"
          style={{ background: COLORS.sidebarBg, color: COLORS.accent }}
        >
          {initials(approver?.name)}
        </span>
        <span className="text-[11.5px]" style={{ color: COLORS.muted }}>
          Signed by <strong>{approver?.name}</strong>
        </span>
      </div>
    </Link>
  );
}
