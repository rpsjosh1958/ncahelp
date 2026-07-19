import { useQuery } from "@tanstack/react-query";
import { getLetter, getLetters } from "@/lib/api/letters";

export function useLetters() {
  return useQuery({ queryKey: ["letters"], queryFn: getLetters });
}

export function useLetter(id: string | undefined) {
  return useQuery({
    queryKey: ["letters", id],
    queryFn: () => getLetter(id as string),
    enabled: !!id,
  });
}
