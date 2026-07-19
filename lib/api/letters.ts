import lettersData from "@/data/letters.json";
import type { LetterTemplate } from "@/lib/types";

const letters = lettersData as LetterTemplate[];

// TODO: replace with real API call, e.g. fetch("/api/letters").then((r) => r.json())
export async function getLetters(): Promise<LetterTemplate[]> {
  return letters;
}

// TODO: replace with real API call, e.g. fetch(`/api/letters/${id}`).then((r) => r.json())
export async function getLetter(id: string): Promise<LetterTemplate | undefined> {
  return letters.find((l) => l.id === id);
}
