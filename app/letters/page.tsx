"use client";

import { useState } from "react";
import { LetterCard } from "@/components/letters/letter-card";
import { SearchInput } from "@/components/search/search-input";
import { useDivisions } from "@/hooks/use-divisions";
import { useLetters } from "@/hooks/use-letters";
import { useOrgChart } from "@/hooks/use-org-chart";
import { matchesQuery } from "@/lib/search";
import { COLORS } from "@/lib/theme";

export default function LettersPage() {
  const { data: letters, isPending } = useLetters();
  const { data: divisions } = useDivisions();
  const { data: org } = useOrgChart();
  const [search, setSearch] = useState("");

  const filtered = letters?.filter((l) => matchesQuery(search, l.title, l.description, l.refFormat));

  return (
    <div className="mx-auto flex max-w-[980px] flex-col gap-5 px-4 py-6 pb-12 sm:px-6 md:px-10 md:py-9">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-extrabold" style={{ color: COLORS.ink }}>
          Letter templates
        </h1>
        <p className="text-[13.5px]" style={{ color: COLORS.muted2 }}>
          Standard formats for official correspondence, each with its designated approver.
        </p>
      </header>

      <SearchInput value={search} onChange={setSearch} placeholder="Search letter templates…" className="max-w-sm" />

      {isPending ? (
        <div className="text-sm" style={{ color: COLORS.muted2 }}>
          Loading…
        </div>
      ) : filtered?.length ? (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          {filtered.map((l) => (
            <LetterCard
              key={l.id}
              letter={l}
              division={divisions?.find((d) => d.id === l.division)}
              approver={org?.people.find((p) => p.id === l.approverId)}
            />
          ))}
        </div>
      ) : (
        <div className="text-sm" style={{ color: COLORS.muted2 }}>
          No letter templates match &ldquo;{search}&rdquo;.
        </div>
      )}
    </div>
  );
}
