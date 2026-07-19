import walkthroughsData from "@/data/walkthroughs.json";
import type { DivisionId, Walkthrough } from "@/lib/types";

const walkthroughs = walkthroughsData as Walkthrough[];

// TODO: replace with real API call, e.g. fetch("/api/walkthroughs").then((r) => r.json())
export async function getWalkthroughs(): Promise<Walkthrough[]> {
  return walkthroughs;
}

// TODO: replace with real API call, e.g. fetch(`/api/walkthroughs/${id}`).then((r) => r.json())
export async function getWalkthrough(id: string): Promise<Walkthrough | undefined> {
  return walkthroughs.find((w) => w.id === id);
}

// TODO: replace with real API call, e.g. fetch(`/api/walkthroughs?division=${division}`).then((r) => r.json())
export async function getWalkthroughsByDivision(division: DivisionId): Promise<Walkthrough[]> {
  return walkthroughs.filter((w) => w.division === division);
}
