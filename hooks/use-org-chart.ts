import { useQuery } from "@tanstack/react-query";
import { getOrgChart } from "@/lib/api/org-chart";

export function useOrgChart() {
  return useQuery({ queryKey: ["org-chart"], queryFn: getOrgChart });
}
