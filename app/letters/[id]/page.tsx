"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ApprovalChain } from "@/components/letters/approval-chain";
import { FormattedText } from "@/components/letters/formatted-text";
import { useLetter } from "@/hooks/use-letters";
import { useOrgChart } from "@/hooks/use-org-chart";
import { COLORS } from "@/lib/theme";
import type { LetterTemplate, OrgPerson } from "@/lib/types";

type View = "format" | "sample";

const LETTERHEAD_CLASS = "flex flex-col gap-4.5 rounded-[4px] bg-white p-6 sm:p-8 md:p-[46px_52px]";
const LETTERHEAD_STYLE = { border: `1px solid ${COLORS.border}`, boxShadow: "0 3px 18px rgba(15,36,39,0.08)" };

export default function LetterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: letter, isPending } = useLetter(id);
  const { data: org } = useOrgChart();
  const [view, setView] = useState<View>("format");

  if (isPending) {
    return <div className="px-10 py-9 text-sm" style={{ color: COLORS.muted2 }}>Loading…</div>;
  }
  if (!letter) {
    return <div className="px-10 py-9 text-sm" style={{ color: COLORS.muted2 }}>Letter template not found.</div>;
  }

  const approver = org?.people.find((p) => p.id === letter.approverId);
  const chain = letter.approvalChain
    .map((pid) => org?.people.find((p) => p.id === pid))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div className="mx-auto flex max-w-[1040px] flex-col gap-5 px-4 py-6 pb-12 sm:px-6 md:px-10 md:py-8">
      <Link
        href="/letters"
        className="flex w-fit items-center gap-1.5 font-mono text-[11px] tracking-[0.1em]"
        style={{ color: COLORS.muted3 }}
      >
        <ArrowLeft className="h-3.5 w-3.5" /> LETTER TEMPLATES
      </Link>

      <div className="flex items-center gap-1.5">
        {(["format", "sample"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className="rounded-full px-3.5 py-1.5 font-mono text-[11px] tracking-[0.1em] transition-colors"
            style={{
              background: view === v ? COLORS.ink : "transparent",
              color: view === v ? COLORS.accentHover : COLORS.muted2,
              border: `1px solid ${view === v ? COLORS.ink : COLORS.borderHover}`,
            }}
          >
            {v === "format" ? "FORMAT" : "VIEW SAMPLE"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_320px]">
        <div className={LETTERHEAD_CLASS} style={LETTERHEAD_STYLE}>
          <div className="flex flex-col gap-0.5 border-b-2 pb-3.5 text-center" style={{ borderColor: COLORS.ink }}>
            <div className="text-[15px] font-extrabold tracking-[0.06em]" style={{ color: COLORS.ink }}>
              NATIONAL COMMUNICATIONS AUTHORITY
            </div>
            <div className="font-mono text-[10px] tracking-[0.22em]" style={{ color: COLORS.muted3 }}>
              ENGINEERING DIVISION · ACCRA
            </div>
          </div>

          {view === "format" ? (
            <FormatBody letter={letter} approver={approver} />
          ) : (
            <SampleBody letter={letter} approver={approver} />
          )}
        </div>

        <aside className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-2 rounded-xl border bg-white p-5" style={{ borderColor: COLORS.border }}>
            <div className="font-mono text-[10px] tracking-[0.14em]" style={{ color: COLORS.muted3 }}>
              TEMPLATE
            </div>
            <div className="text-base font-extrabold" style={{ color: COLORS.ink }}>
              {letter.title}
            </div>
            <div className="text-[12.5px] leading-relaxed" style={{ color: COLORS.muted2 }}>
              {letter.description}
            </div>
            {letter.officialUrl && (
              <a
                href={letter.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex w-fit items-center gap-1.5 border-t pt-2.5 font-mono text-[10.5px] tracking-[0.06em] transition-colors"
                style={{ borderColor: COLORS.border2, color: COLORS.accentDark }}
              >
                NCA OFFICIAL LICENSING PAGE
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <ApprovalChain chain={chain} />
        </aside>
      </div>
    </div>
  );
}

type Approver = OrgPerson | undefined;

function SignatureBlock({ signoff, approver }: { signoff: string; approver: Approver }) {
  return (
    <div className="mt-1.5 flex flex-col gap-6.5">
      <div className="text-[12.5px]" style={{ color: COLORS.muted }}>
        {signoff}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="font-mono text-base italic" style={{ color: COLORS.ink }}>
          {approver?.name}
        </div>
        <div className="w-[220px] border-t pt-1 text-xs font-bold" style={{ color: COLORS.ink, borderColor: COLORS.ink2 }}>
          {approver?.name}
        </div>
        <div className="text-[11px]" style={{ color: COLORS.muted3 }}>
          {approver?.title}
        </div>
      </div>
    </div>
  );
}

function FormatBody({ letter, approver }: { letter: LetterTemplate; approver: Approver }) {
  const ref = letter.refFormat.replace("YYYY", "2026").replace("###", "041");
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <div className="flex justify-between font-mono text-[11px]" style={{ color: COLORS.muted }}>
        <span>{ref}</span>
        <span>{date}</span>
      </div>

      <div className="flex flex-col gap-0.5 text-[12.5px] italic" style={{ color: COLORS.faint }}>
        <div>[RECIPIENT NAME / TITLE]</div>
        <div>[ORGANISATION]</div>
        <div>[ADDRESS]</div>
      </div>

      <div className="text-[12.5px]" style={{ color: COLORS.muted }}>
        {letter.format.salutation}
      </div>

      <div className="text-center text-[13px] font-extrabold tracking-[0.01em] underline" style={{ color: COLORS.ink }}>
        {letter.format.subject}
      </div>

      <div className="flex flex-col gap-3">
        {letter.format.bodyOutline.map((text, i) => (
          <div key={text} className="flex items-baseline gap-2.5">
            <span className="shrink-0 font-mono text-[10px]" style={{ color: COLORS.accentDark }}>
              ¶{i + 1}
            </span>
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-xs font-semibold" style={{ color: COLORS.muted }}>
                {text}
              </span>
              <span className="block h-1.5 w-full rounded-[3px]" style={{ background: COLORS.border2 }} />
              <span
                className="block h-1.5 rounded-[3px]"
                style={{ background: COLORS.border2, width: `${45 + ((i * 37) % 40)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <SignatureBlock signoff={letter.format.signoff} approver={approver} />

      {letter.format.enclosures.length > 0 && (
        <div className="border-t pt-2.5 font-mono text-[10.5px]" style={{ color: COLORS.faint, borderColor: COLORS.border2 }}>
          ENCL: {letter.format.enclosures.join(" · ")}
        </div>
      )}
    </>
  );
}

function SampleBody({ letter, approver }: { letter: LetterTemplate; approver: Approver }) {
  const { sample } = letter;

  return (
    <>
      <div className="flex justify-between font-mono text-[11px]" style={{ color: COLORS.muted }}>
        <span>{sample.ref}</span>
        <span>{sample.date}</span>
      </div>

      <div className="flex flex-col gap-0.5 text-[12.5px]" style={{ color: COLORS.ink2 }}>
        {sample.recipientLines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>

      <div className="text-[12.5px]" style={{ color: COLORS.muted }}>
        {sample.salutation}
      </div>

      <div className="text-center text-[13px] font-extrabold tracking-[0.01em] underline" style={{ color: COLORS.ink }}>
        {sample.subject}
      </div>

      <div className="flex flex-col gap-3">
        {sample.body.map((paragraph) => (
          <p key={paragraph} className="text-justify text-[12.5px] leading-relaxed" style={{ color: COLORS.ink2 }}>
            <FormattedText text={paragraph} />
          </p>
        ))}
      </div>

      <SignatureBlock signoff={sample.signoff} approver={approver} />

      {sample.typistCode && (
        <div className="font-mono text-[7px]" style={{ color: COLORS.faint }}>
          {sample.typistCode}
        </div>
      )}

      {sample.attachmentNote && (
        <div className="border-t pt-2.5 text-[12.5px]" style={{ color: COLORS.muted, borderColor: COLORS.border2 }}>
          {sample.attachmentNote}
        </div>
      )}
    </>
  );
}
