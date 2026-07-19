import type { Division, OrgPerson } from "@/lib/types";
import { COLORS } from "@/lib/theme";

const RANK_LABELS: Record<number, string> = {
  1: "FINAL SIGNATORY",
  2: "DIRECTOR",
  3: "DEPUTY DIRECTOR",
  4: "DIVISION HEAD",
  5: "OFFICER",
};

function PersonCard({ person, division }: { person: OrgPerson; division: Division | undefined }) {
  const topColor = division?.color ?? COLORS.ink;
  return (
    <div
      className="box-border flex w-[210px] flex-col gap-1.5 rounded-[10px] border bg-white p-3.5"
      style={{ borderColor: COLORS.border, borderTop: `3px solid ${topColor}` }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9.5px] tracking-[0.12em]" style={{ color: COLORS.faint }}>
          {RANK_LABELS[person.rank] ?? "STAFF"}
        </span>
        {division && <span className="h-[7px] w-[7px] rounded-sm" style={{ background: division.color }} />}
      </div>
      <div className="text-[13px] font-bold leading-tight" style={{ color: COLORS.ink }}>
        {person.name}
      </div>
      <div className="text-[11px] leading-snug" style={{ color: COLORS.muted2 }}>
        {person.title}
      </div>
      {person.signs && (
        <div className="border-t pt-1.5 text-[10.5px] leading-snug" style={{ color: COLORS.faint, borderColor: COLORS.border2 }}>
          {person.signs}
        </div>
      )}
    </div>
  );
}

export function OrgTree({ people, divisions }: { people: OrgPerson[]; divisions: Division[] }) {
  const tiers = new Map<number, OrgPerson[]>();
  for (const p of people) {
    if (!tiers.has(p.rank)) tiers.set(p.rank, []);
    tiers.get(p.rank)!.push(p);
  }
  const ranks = [...tiers.keys()].sort((a, b) => a - b);
  const divById = (id: string | null) => (id ? divisions.find((d) => d.id === id) : undefined);

  return (
    <div className="flex flex-col items-center gap-0">
      {ranks.map((rank, ti) => (
        <div key={rank} className="flex flex-col items-center">
          {ti > 0 && <span className="block h-[22px] w-px" style={{ background: COLORS.borderHover }} />}
          <div className="flex flex-wrap justify-center gap-3">
            {tiers.get(rank)!.map((person) => (
              <PersonCard key={person.id} person={person} division={divById(person.division)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
