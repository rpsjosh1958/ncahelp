import divisionsData from "@/data/divisions.json";
import type { Division, DivisionId } from "@/lib/types";

const divisions = divisionsData as Division[];

// TODO: replace with real API call, e.g. fetch("/api/divisions").then((r) => r.json())
export async function getDivisions(): Promise<Division[]> {
  return divisions;
}

// TODO: replace with real API call, e.g. fetch(`/api/divisions/${id}`).then((r) => r.json())
export async function getDivision(id: DivisionId): Promise<Division | undefined> {
  return divisions.find((d) => d.id === id);
}
