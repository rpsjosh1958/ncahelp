import { getDivisions } from "@/lib/api/divisions";
import { getLetters } from "@/lib/api/letters";
import { getOrgChart } from "@/lib/api/org-chart";
import { getWalkthroughs } from "@/lib/api/walkthroughs";
import type { Division, LetterTemplate, OrgChart, OrgPerson, Walkthrough } from "@/lib/types";

export interface DeskLink {
  type: "walkthrough" | "letter" | "approvals";
  id: string | null;
  label: string;
}

export interface DeskAnswer {
  text: string;
  items?: string[];
  link?: DeskLink;
}

interface KnowledgeBase {
  walkthroughs: Walkthrough[];
  letters: LetterTemplate[];
  org: OrgChart;
  divisions: Division[];
}

const STOP = new Set([
  "the", "and", "for", "with", "you", "can", "does", "how", "what", "who", "are", "our", "out", "get", "has",
  "have", "this", "that", "from", "into", "about", "when", "where", "why", "will", "shall", "need", "want",
  "please", "show", "tell", "give", "all", "any", "one", "new", "not", "its", "was", "were", "they", "them",
  "then", "than", "she", "him", "her", "his", "also", "just", "like", "make", "made", "some", "more", "most",
  "off", "per", "via",
]);

function norm(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function toks(s: string): string[] {
  return norm(s)
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function overlap(queryToks: string[], text: string, weight: number): number {
  const set = new Set(toks(text));
  let n = 0;
  for (const t of queryToks) {
    if (set.has(t) || [...set].some((w) => w.startsWith(t) || t.startsWith(w))) n++;
  }
  return n * weight;
}

/**
 * Local scoring matcher standing in for a real model. It reads the same
 * walkthroughs/letters/org-chart data the rest of the app renders, so its
 * answers stay grounded in what's actually on file.
 */
function keywordMatchAnswer(query: string, data: KnowledgeBase): DeskAnswer {
  const { walkthroughs, letters, org, divisions } = data;
  const q = norm(query);
  const qt = toks(query);
  const person = (id: string): OrgPerson | undefined => org.people.find((p) => p.id === id);
  const divName = (id: string): string => divisions.find((d) => d.id === id)?.name ?? id;

  if (/^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(q)) {
    return {
      text: "Hello! I answer from the Engineering knowledge base — walkthroughs, letter templates, and the approval chain. Try asking how to do something, or who signs a letter.",
    };
  }

  // Intent: "who approves / signs …"
  if (/\bwho\b/.test(q) && /(approv|sign|authoris|authoriz)/.test(q)) {
    let best: LetterTemplate | null = null;
    let bs = 0;
    for (const l of letters) {
      const s = overlap(qt, `${l.title} ${l.description} ${divName(l.division)}`, 2);
      if (s > bs) {
        bs = s;
        best = l;
      }
    }
    if (best) {
      const ap = person(best.approverId);
      const chain = best.approvalChain.map((id, i) => {
        const p = person(id);
        return `${i + 1}. ${p?.name} — ${p?.title}`;
      });
      return {
        text: `The ${best.title} is signed by ${ap?.name}, ${ap?.title}. It moves through ${best.approvalChain.length} approval ${best.approvalChain.length === 1 ? "step" : "steps"}:`,
        items: chain,
        link: { type: "letter", id: best.id, label: "Open template" },
      };
    }
  }

  // Intent: person lookup
  for (const p of org.people) {
    if (overlap(qt, `${p.name} ${p.title}`, 1) >= 2) {
      return {
        text: `${p.name} is the ${p.title}${p.division ? ` (${divName(p.division)})` : ""}.${p.signs ? " Signs: " + p.signs : ""}`,
        link: { type: "approvals", id: p.id, label: "View approval chart" },
      };
    }
  }

  // Best match across walkthroughs and letters
  let best: Walkthrough | LetterTemplate | null = null;
  let bestScore = 0;
  let bestType: "walkthrough" | "letter" | null = null;

  for (const w of walkthroughs) {
    const s =
      overlap(qt, w.title, 4) +
      overlap(qt, w.tags.join(" "), 3) +
      overlap(qt, w.summary, 2) +
      overlap(qt, w.steps.map((x) => x.title).join(" "), 1) +
      overlap(qt, divName(w.division), 2);
    if (s > bestScore) {
      bestScore = s;
      best = w;
      bestType = "walkthrough";
    }
  }
  for (const l of letters) {
    const s = overlap(qt, l.title, 4) + overlap(qt, l.description, 2) + overlap(qt, divName(l.division), 2);
    if (s > bestScore) {
      bestScore = s;
      best = l;
      bestType = "letter";
    }
  }

  if (best && bestScore >= 2) {
    if (bestType === "walkthrough") {
      const w = best as Walkthrough;
      const first = w.steps.slice(0, 4).map((s, i) => `${i + 1}. ${s.title}`);
      if (w.steps.length > 4) first.push(`… ${w.steps.length - 4} more steps in the full walkthrough`);
      return {
        text: `Here's "${w.title}" (${divName(w.division)}, ${w.duration}). ${w.summary}`,
        items: first,
        link: { type: "walkthrough", id: w.id, label: "Open walkthrough" },
      };
    }
    const l = best as LetterTemplate;
    const ap = person(l.approverId);
    return {
      text: `${l.title} — ${l.description} Reference format ${l.refFormat}; signed by ${ap?.name} (${ap?.title}).`,
      items: l.format.bodyOutline.slice(0, 3).map((x) => "¶ " + x),
      link: { type: "letter", id: l.id, label: "Open template" },
    };
  }

  return {
    text: "I couldn't find that in the knowledge base yet. I can help with walkthroughs (e.g. “start of shift at the BMC”), letter templates and their approvers, or who signs what across the four divisions.",
    items: ["How do I start a shift at the BMC?", "Who signs a frequency authorisation?", "Steps to register a new ISP"],
  };
}

/**
 * Single entry point the chat panel calls to get an answer. This is the one
 * function to swap when a real model is wired up.
 */
export async function answerQuery(query: string): Promise<DeskAnswer> {
  const [walkthroughs, letters, org, divisions] = await Promise.all([
    getWalkthroughs(),
    getLetters(),
    getOrgChart(),
    getDivisions(),
  ]);

  // ============================================================
  // TODO: PLACEHOLDER AI — replace this body with a real model call, e.g.:
  //
  //   const context = buildContext({ walkthroughs, letters, org, divisions });
  //   const res = await fetch("/api/ask", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ query, context }),
  //   });
  //   return res.json() as Promise<DeskAnswer>;
  //
  // The return shape (text / items? / link?) stays identical, so the chat
  // panel needs zero changes when the real API lands. Everything below is
  // demo-only keyword-overlap scoring, not a real AI call.
  // ============================================================
  return keywordMatchAnswer(query, { walkthroughs, letters, org, divisions });
}
