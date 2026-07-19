"use client";

import { LayoutDashboard, ListChecks, Mail, PanelLeftClose, PanelLeftOpen, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip } from "@/components/layout/tooltip";
import { useClock } from "@/hooks/use-clock";
import { useDivisions } from "@/hooks/use-divisions";
import { useLetters } from "@/hooks/use-letters";
import { useOrgChart } from "@/hooks/use-org-chart";
import { useWalkthroughs } from "@/hooks/use-walkthroughs";
import { COLORS } from "@/lib/theme";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

const EXPANDED_WIDTH = 228;
const COLLAPSED_WIDTH = 64;

export function SidebarNav({
  collapsed: collapsedProp,
  onToggleCollapsed,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** When provided, renders as the mobile drawer variant: always expanded, toggle button becomes a close (X). */
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname();
  const now = useClock();
  const { data: walkthroughs } = useWalkthroughs();
  const { data: letters } = useLetters();
  const { data: org } = useOrgChart();
  const { data: divisions } = useDivisions();

  const clock = [now.getHours(), now.getMinutes(), now.getSeconds()].map(pad).join(":");
  const bmc = divisions?.find((d) => d.id === "bmc");
  const [onDutyLabel, onDutyTime] = bmc?.onDuty ? bmc.onDuty.split(" · ") : ["Off duty", ""];
  // The mobile drawer variant is always shown fully expanded — collapsing only makes sense for the persistent desktop rail.
  const collapsed = collapsedProp && !onCloseMobile;

  const navItems = [
    { code: "01", label: "Overview", href: "/", count: "", icon: LayoutDashboard, match: (p: string) => p === "/" },
    { code: "02", label: "Walkthroughs", href: "/walkthroughs", count: String(walkthroughs?.length ?? ""), icon: ListChecks, match: (p: string) => p.startsWith("/walkthroughs") },
    { code: "03", label: "Letters", href: "/letters", count: String(letters?.length ?? ""), icon: Mail, match: (p: string) => p.startsWith("/letters") },
    { code: "04", label: "Approvals", href: "/approvals", count: String(org?.people.length ?? ""), icon: Users, match: (p: string) => p.startsWith("/approvals") },
  ];

  return (
    <nav
      className="flex h-full shrink-0 flex-col p-3.5 transition-[width] duration-200"
      style={{
        background: COLORS.sidebarBg,
        width: onCloseMobile ? "100%" : collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
      }}
    >
      <div className={`flex items-center pb-5.5 pt-1 ${collapsed ? "flex-col gap-3" : "gap-2.5 px-2"}`}>
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2.5" style={collapsed ? { flex: "none" } : undefined}>
          <Image src="/nca-logo.png" alt="NCA logo" width={28} height={28} className="shrink-0" priority />
          {!collapsed && (
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-[15px] font-extrabold tracking-wide" style={{ color: COLORS.sidebarFg }}>
                NCA · ENG
              </span>
              <span className="whitespace-nowrap font-mono text-[9.5px] tracking-[0.08em]" style={{ color: COLORS.sidebarMuted }}>
                KNOWLEDGE DESK
              </span>
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={onCloseMobile ?? onToggleCollapsed}
          title={onCloseMobile ? "Close menu" : collapsed ? "Expand menu" : "Collapse menu"}
          aria-label={onCloseMobile ? "Close menu" : collapsed ? "Expand menu" : "Collapse menu"}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors"
          style={{ color: COLORS.sidebarMuted }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = COLORS.sidebarFg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = COLORS.sidebarMuted;
          }}
        >
          {onCloseMobile ? (
            <X className="h-4 w-4" />
          ) : collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          const link = (
            <Link
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center rounded-lg text-[13.5px] font-semibold transition-colors ${
                collapsed ? "w-full justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2.5"
              }`}
              style={{
                background: active ? COLORS.accentTintStrong : "transparent",
                color: active ? COLORS.accent : COLORS.sidebarMuted3,
              }}
            >
              {collapsed ? (
                <Icon className="h-4 w-4" />
              ) : (
                <>
                  <span className="font-mono text-[10px] opacity-55">{item.code}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.count && <span className="font-mono text-[10.5px] opacity-50">{item.count}</span>}
                </>
              )}
            </Link>
          );

          return collapsed ? (
            <Tooltip key={item.href} label={item.count ? `${item.label} · ${item.count}` : item.label}>
              {link}
            </Tooltip>
          ) : (
            <div key={item.href}>{link}</div>
          );
        })}
      </div>

      <div className="flex-1" />

      {collapsed ? (
        <Tooltip label={`BMC · ${onDutyLabel} · ${onDutyTime}`}>
          <div className="flex w-full justify-center py-2">
            <span
              className="h-[7px] w-[7px] rounded-full"
              style={{ background: COLORS.accent, animation: "pulse 2s ease-in-out infinite" }}
            />
          </div>
        </Tooltip>
      ) : (
        <div className="flex flex-col gap-1.5 rounded-[10px] border p-3" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-1.5">
            <span
              className="h-[7px] w-[7px] rounded-full"
              style={{ background: COLORS.accent, animation: "pulse 2s ease-in-out infinite" }}
            />
            <span className="font-mono text-[10px] tracking-[0.12em]" style={{ color: COLORS.accent }}>
              ON DUTY
            </span>
          </div>
          <div className="text-[12.5px] font-semibold" style={{ color: COLORS.sidebarFg2 }}>
            BMC · {onDutyLabel}
          </div>
          <div className="font-mono text-[11px]" style={{ color: COLORS.sidebarMuted }}>
            {onDutyTime} · {clock}
          </div>
        </div>
      )}
    </nav>
  );
}
