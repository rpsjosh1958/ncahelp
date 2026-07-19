import type { OrgPerson } from "@/lib/types";
import { COLORS } from "@/lib/theme";

export function ApprovalChain({ chain }: { chain: OrgPerson[] }) {
  return (
    <div className="flex flex-col gap-3.5 rounded-xl p-5" style={{ background: COLORS.sidebarBg }}>
      <div className="font-mono text-[10px] tracking-[0.14em]" style={{ color: COLORS.sidebarMuted }}>
        APPROVAL CHAIN
      </div>
      <div className="flex flex-col">
        {chain.map((person, i) => {
          const last = i === chain.length - 1;
          return (
            <div key={person.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-semibold"
                  style={{
                    background: last ? COLORS.accent : "transparent",
                    color: last ? "#FFFFFF" : COLORS.sidebarMuted,
                    borderColor: last ? COLORS.accent : "rgba(255,255,255,0.25)",
                  }}
                >
                  {i + 1}
                </span>
                {!last && <span className="w-px flex-1" style={{ background: "rgba(255,255,255,0.15)", minHeight: 14 }} />}
              </div>
              <div className="flex flex-col gap-0.5 pb-3.5">
                <div className="text-[12.5px] font-bold" style={{ color: COLORS.sidebarFg2 }}>
                  {person.name}
                </div>
                <div className="text-[11px]" style={{ color: COLORS.sidebarMuted }}>
                  {person.title}
                </div>
                <div
                  className="font-mono text-[9.5px] tracking-[0.1em]"
                  style={{ color: last ? COLORS.accentHover : COLORS.sidebarMuted }}
                >
                  {last ? "SIGNS" : "REVIEWS & FORWARDS"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
