"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { SearchInput } from "@/components/search/search-input";
import { WalkthroughCard } from "@/components/walkthroughs/walkthrough-card";
import { useDivisions } from "@/hooks/use-divisions";
import { useWalkthroughs } from "@/hooks/use-walkthroughs";
import { matchesQuery } from "@/lib/search";
import { COLORS } from "@/lib/theme";
import type { DivisionId } from "@/lib/types";

export function WalkthroughsView() {
  const searchParams = useSearchParams();
  const initialDivision = (searchParams.get("division") as DivisionId | null) ?? "all";
  const [divFilter, setDivFilter] = useState<DivisionId | "all">(initialDivision);
  const [search, setSearch] = useState("");

  const { data: walkthroughs, isPending } = useWalkthroughs();
  const { data: divisions } = useDivisions();

  const filtered = walkthroughs
    ?.filter((w) => divFilter === "all" || w.division === divFilter)
    .filter((w) => matchesQuery(search, w.title, w.summary, w.tags));
  const divById = (id: string) => divisions?.find((d) => d.id === id);

  return (
    <div className="mx-auto flex max-w-[980px] flex-col gap-5 px-4 py-6 pb-12 sm:px-6 md:px-10 md:py-9">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-extrabold" style={{ color: COLORS.ink }}>
          Walkthroughs
        </h1>
        <p className="text-[13.5px]" style={{ color: COLORS.muted2 }}>
          Step-by-step operating procedures, kept current by the divisions that own them.
        </p>
      </header>

      <SearchInput value={search} onChange={setSearch} placeholder="Search walkthroughs…" className="max-w-sm" />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDivFilter("all")}
          className="rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em]"
          style={{
            borderColor: divFilter === "all" ? COLORS.ink : COLORS.borderHover,
            background: divFilter === "all" ? COLORS.ink : "transparent",
            color: divFilter === "all" ? COLORS.accentHover : COLORS.muted2,
          }}
        >
          ALL
        </button>
        {divisions?.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDivFilter(d.id)}
            className="rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em]"
            style={{
              borderColor: divFilter === d.id ? COLORS.ink : COLORS.borderHover,
              background: divFilter === d.id ? COLORS.ink : "transparent",
              color: divFilter === d.id ? COLORS.accentHover : COLORS.muted2,
            }}
          >
            {d.code}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {isPending ? (
          <div className="text-sm" style={{ color: COLORS.muted2 }}>
            Loading…
          </div>
        ) : filtered?.length ? (
          filtered.map((w) => <WalkthroughCard key={w.id} walkthrough={w} division={divById(w.division)} />)
        ) : (
          <div className="text-sm" style={{ color: COLORS.muted2 }}>
            No walkthroughs match &ldquo;{search}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
