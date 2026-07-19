// Central palette for the NCA Knowledge Desk redesign. The source design is
// almost entirely inline-styled (colors chosen per element, not a small
// reusable token set), so components reference these constants directly via
// `style` rather than Tailwind color utilities.
//
// Neutrals use Tailwind's "slate" scale (a blue-leaning gray) rather than the
// original teal/green-tinted grays — this matches nca.org.gh itself, which
// uses true/cool neutral grays for all text and chrome, reserving color
// purely for the brand blue accent.
export const COLORS = {
  sidebarBg: "#0F172A", // slate-900
  sidebarBorder: "rgba(255,255,255,0.08)",
  sidebarFg: "#F8FAFC", // slate-50
  sidebarFg2: "#E2E8F0", // slate-200
  sidebarMuted: "#94A3B8", // slate-400
  sidebarMuted2: "#E2E8F0", // slate-200
  sidebarMuted3: "#CBD5E1", // slate-300

  contentBg: "#F8FAFC", // slate-50
  panel: "#FFFFFF",

  ink: "#0F172A", // slate-900
  ink2: "#1E293B", // slate-800
  muted: "#475569", // slate-600
  muted2: "#64748B", // slate-500
  muted3: "#64748B", // slate-500
  faint: "#94A3B8", // slate-400

  border: "#E2E8F0", // slate-200
  border2: "#F1F5F9", // slate-100
  borderHover: "#CBD5E1", // slate-300

  // Main theme accent — pulled from nca.org.gh's own site (#086AD8 is their
  // header/interactive-state blue, #002FA6 the deeper blue used on heading
  // text), replacing the earlier invented gold/green and system blue.
  accent: "#086AD8",
  accentHover: "#2E90E8",
  accentDark: "#002FA6",
  accentTint: "rgba(8,106,216,0.14)",
  accentTintStrong: "rgba(8,106,216,0.16)",
} as const;
