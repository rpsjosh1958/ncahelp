import orgChartData from "@/data/orgChart.json";
import type { OrgChart } from "@/lib/types";

const orgChart = orgChartData as OrgChart;

// TODO: replace with real API call, e.g. fetch("/api/org-chart").then((r) => r.json())
export async function getOrgChart(): Promise<OrgChart> {
  return orgChart;
}
