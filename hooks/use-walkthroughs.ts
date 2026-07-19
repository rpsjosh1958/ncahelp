import { useQuery } from "@tanstack/react-query";
import { getWalkthrough, getWalkthroughs } from "@/lib/api/walkthroughs";

export function useWalkthroughs() {
  return useQuery({ queryKey: ["walkthroughs"], queryFn: getWalkthroughs });
}

export function useWalkthrough(id: string | undefined) {
  return useQuery({
    queryKey: ["walkthroughs", id],
    queryFn: () => getWalkthrough(id as string),
    enabled: !!id,
  });
}
