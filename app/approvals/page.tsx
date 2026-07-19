"use client";

import Link from "next/link";
import { OrgTree } from "@/components/approvals/org-tree";
import { useDivisions } from "@/hooks/use-divisions";
import { useLetters } from "@/hooks/use-letters";
import { useOrgChart } from "@/hooks/use-org-chart";
import { COLORS } from "@/lib/theme";

export default function ApprovalsPage() {
  const { data: org } = useOrgChart();
  const { data: divisions } = useDivisions();
  const { data: letters } = useLetters();

  const person = (id: string) => org?.people.find((p) => p.id === id);
  const divById = (id: string) => divisions?.find((d) => d.id === id);

  return (
    <div className="mx-auto flex max-w-[1040px] flex-col gap-6.5 px-4 py-6 pb-12 sm:px-6 md:px-10 md:py-9">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-extrabold" style={{ color: COLORS.ink }}>
          Approval chain
        </h1>
        <p className="text-[13.5px]" style={{ color: COLORS.muted2 }}>
          Who signs off on what, from the console desk to the Director General.
        </p>
      </header>

      {org && divisions ? (
        <OrgTree people={org.people} divisions={divisions} />
      ) : (
        <div className="text-sm" style={{ color: COLORS.muted2 }}>
          Loading…
        </div>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-[15px] font-bold" style={{ color: COLORS.ink }}>
          Who signs what
        </h2>
        <div className="flex flex-col overflow-hidden rounded-xl border bg-white" style={{ borderColor: COLORS.border }}>
          {letters?.map((l, i) => {
            const approver = person(l.approverId);
            return (
              <Link
                key={l.id}
                href={`/letters/${l.id}`}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors sm:gap-3.5 sm:px-4.5"
                style={{ borderTop: i > 0 ? `1px solid ${COLORS.border2}` : "none" }}
              >
                <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: divById(l.division)?.color }} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold" style={{ color: COLORS.ink2 }}>
                  {l.title}
                </span>
                <span className="hidden shrink-0 font-mono text-[10.5px] sm:inline" style={{ color: COLORS.faint }}>
                  {l.approvalChain.length} STEPS
                </span>
                <span className="shrink-0 truncate text-xs" style={{ color: COLORS.muted, maxWidth: "40%" }}>
                  → <strong>{approver?.name}</strong>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
