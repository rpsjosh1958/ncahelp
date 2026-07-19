"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDivisions } from "@/hooks/use-divisions";
import { useLetters } from "@/hooks/use-letters";
import { useWalkthroughs } from "@/hooks/use-walkthroughs";
import { SearchInput } from "@/components/search/search-input";
import { matchesQuery } from "@/lib/search";
import { COLORS } from "@/lib/theme";

export default function OverviewPage() {
  const { data: divisions } = useDivisions();
  const { data: walkthroughs } = useWalkthroughs();
  const { data: letters } = useLetters();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const dateStr = new Date()
    .toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    .toUpperCase();

  const recent = [...(walkthroughs ?? [])].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 3);
  const divById = (id: string) => divisions?.find((d) => d.id === id);

  const isSearching = search.trim().length > 0;
  const walkMatches = (walkthroughs ?? [])
    .filter((w) => matchesQuery(search, w.title, w.summary, w.tags))
    .map((w) => ({ kind: "walkthrough" as const, id: w.id, title: w.title, subtitle: w.summary, division: w.division }));
  const letterMatches = (letters ?? [])
    .filter((l) => matchesQuery(search, l.title, l.description, l.refFormat))
    .map((l) => ({ kind: "letter" as const, id: l.id, title: l.title, subtitle: l.description, division: l.division }));
  const results = [...walkMatches, ...letterMatches];

  return (
    <div className="mx-auto flex max-w-[980px] flex-col gap-7 px-4 py-6 pb-12 sm:px-6 md:px-10 md:py-9">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
        <Image
          src="/nca-logo.png"
          alt="NCA logo"
          width={138}
          height={132}
          className="h-20 w-auto shrink-0 sm:h-[132px]"
          priority
        />
        <div className="flex flex-col gap-2">
          <div className="font-mono text-[11px] tracking-[0.12em]" style={{ color: COLORS.muted3 }}>
            ENGINEERING DIVISION · {dateStr}
          </div>
          <h1 className="text-[32px] font-extrabold leading-tight tracking-tight" style={{ color: COLORS.ink }}>
            Knowledge Desk
          </h1>
          <p className="max-w-[560px] text-[14.5px] leading-relaxed" style={{ color: COLORS.muted }}>
            Every walkthrough, letter template and approval chain across the four sub-divisions — searchable by
            staff, answerable by the assistant.
          </p>
        </div>
      </header>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search walkthroughs and letter templates…"
        className="max-w-md"
      />

      {isSearching ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-[15px] font-bold" style={{ color: COLORS.ink }}>
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{search}&rdquo;
          </h2>
          {results.length > 0 ? (
            <div className="flex flex-col gap-2">
              {results.map((r) => (
                <Link
                  key={`${r.kind}-${r.id}`}
                  href={r.kind === "walkthrough" ? `/walkthroughs/${r.id}` : `/letters/${r.id}`}
                  className="flex items-center gap-3.5 rounded-[10px] border bg-white px-4.5 py-3.5 text-left transition-colors"
                  style={{ borderColor: COLORS.border }}
                >
                  <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: divById(r.division)?.color }} />
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[9.5px] tracking-[0.08em]"
                    style={{ background: COLORS.border2, color: COLORS.muted3 }}
                  >
                    {r.kind === "walkthrough" ? "WALKTHROUGH" : "LETTER"}
                  </span>
                  <span className="flex-1 truncate text-[13.5px] font-semibold" style={{ color: COLORS.ink2 }}>
                    {r.title}
                  </span>
                  <span className="hidden max-w-[280px] truncate text-xs sm:block" style={{ color: COLORS.muted3 }}>
                    {r.subtitle}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-sm" style={{ color: COLORS.muted2 }}>
              Nothing on file matches that yet — try asking the assistant instead.
            </div>
          )}
        </section>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {divisions?.map((d) => {
              const walkCount = walkthroughs?.filter((w) => w.division === d.id).length ?? 0;
              const letterCount = letters?.filter((l) => l.division === d.id).length ?? 0;
              return (
                <div
                  key={d.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/walkthroughs?division=${d.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") router.push(`/walkthroughs?division=${d.id}`);
                  }}
                  className="flex cursor-pointer flex-col gap-2.5 rounded-xl border bg-white p-5 text-left transition-shadow"
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
                    <span className="h-[9px] w-[9px] rounded-sm" style={{ background: d.color }} />
                    <span className="font-mono text-[10.5px] tracking-[0.12em]" style={{ color: COLORS.muted3 }}>
                      {d.code} · {d.band}
                    </span>
                  </div>
                  <div className="text-base font-bold" style={{ color: COLORS.ink }}>
                    {d.name}
                  </div>
                  <div className="text-[12.5px] leading-relaxed" style={{ color: COLORS.muted2 }}>
                    {d.summary}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-mono text-[10.5px]" style={{ color: COLORS.faint }}>
                      {walkCount} WALKTHROUGHS · {letterCount} TEMPLATES
                    </div>
                    {d.officialUrl && (
                      <a
                        href={d.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex shrink-0 items-center gap-1 font-mono text-[10px] tracking-[0.06em] transition-colors"
                        style={{ color: COLORS.accentDark }}
                      >
                        NCA.ORG.GH
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <section className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[15px] font-bold" style={{ color: COLORS.ink }}>
                Recently updated
              </h2>
              <Link href="/walkthroughs" className="font-mono text-[11px] tracking-[0.1em]" style={{ color: COLORS.accentDark }}>
                ALL WALKTHROUGHS →
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {recent.map((w) => (
                <Link
                  key={w.id}
                  href={`/walkthroughs/${w.id}`}
                  className="flex items-center gap-3.5 rounded-[10px] border bg-white px-4.5 py-3.5 text-left transition-colors"
                  style={{ borderColor: COLORS.border }}
                >
                  <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: divById(w.division)?.color }} />
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold" style={{ color: COLORS.ink2 }}>
                    {w.title}
                  </span>
                  <span className="shrink-0 font-mono text-[10.5px]" style={{ color: COLORS.faint }}>
                    {w.steps.length} STEPS
                    <span className="hidden sm:inline"> · UPD {w.updated}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
