import { useQuery } from "@tanstack/react-query";
import { getDivision, getDivisions } from "@/lib/api/divisions";
import type { DivisionId } from "@/lib/types";

export function useDivisions() {
  return useQuery({ queryKey: ["divisions"], queryFn: getDivisions });
}

export function useDivision(id: DivisionId | undefined) {
  return useQuery({
    queryKey: ["divisions", id],
    queryFn: () => getDivision(id as DivisionId),
    enabled: !!id,
  });
}
