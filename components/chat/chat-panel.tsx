"use client";

import { X } from "lucide-react";
import { Equalizer } from "@/components/layout/equalizer";
import { type DeskMessage, useDeskChat } from "@/components/desk/desk-chat-provider";
import { COLORS } from "@/lib/theme";

const SUGGESTIONS = [
  "How do I start a shift at the BMC?",
  "Who signs a frequency authorisation?",
  "What are the steps to register a new ISP?",
];

function MessageBubble({
  message,
  isLast,
  onNavigate,
}: {
  message: DeskMessage;
  isLast: boolean;
  /** Called (in addition to the link navigating) when a link is followed — closes the mobile full-screen overlay so the destination page is actually visible. */
  onNavigate?: () => void;
}) {
  const { openLink } = useDeskChat();
  const isUser = message.role === "user";
  const scrollRef = isLast
    ? (node: HTMLDivElement | null) => node?.scrollIntoView({ behavior: "smooth", block: "end" })
    : undefined;

  return (
    <div ref={scrollRef} className="flex flex-col" style={{ alignItems: isUser ? "flex-end" : "flex-start" }}>
      <div
        className="flex max-w-[88%] flex-col gap-2 px-3.5 py-2.5 text-[13px] leading-relaxed"
        style={{
          borderRadius: isUser ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
          background: isUser ? COLORS.accent : "rgba(255,255,255,0.05)",
          border: `1px solid ${isUser ? COLORS.accent : "rgba(255,255,255,0.1)"}`,
          color: isUser ? "#FFFFFF" : COLORS.sidebarFg2,
        }}
      >
        <div>{message.text}</div>
        {!!message.items?.length && (
          <div className="flex flex-col gap-1.5 border-l-2 pl-2.5" style={{ borderColor: "rgba(8,106,216,0.5)" }}>
            {message.items.map((item) => (
              <div key={item} className="font-mono text-xs leading-snug" style={{ color: COLORS.sidebarMuted2 }}>
                {item}
              </div>
            ))}
          </div>
        )}
        {message.link && (
          <button
            type="button"
            onClick={() => {
              openLink(message.link);
              onNavigate?.();
            }}
            className="self-start rounded-md border px-3 py-1.5 font-mono text-[10.5px] tracking-[0.08em] transition-colors"
            style={{ borderColor: "rgba(8,106,216,0.55)", color: COLORS.accentHover }}
          >
            {message.link.label.toUpperCase()} ↗
          </button>
        )}
      </div>
    </div>
  );
}

export function ChatPanel({ onClose }: { onClose?: () => void } = {}) {
  const { messages, input, setInput, thinking, ask } = useDeskChat();
  const showChips = messages.filter((m) => m.role === "user").length === 0;

  return (
    <aside
      className="flex h-full w-full flex-col"
      style={{ background: COLORS.sidebarBg }}
    >
      <div className="flex items-center gap-3 border-b px-5 py-4.5" style={{ borderColor: COLORS.sidebarBorder }}>
        <Equalizer height={22} color={COLORS.accent} />
        <div className="flex flex-1 flex-col">
          <span className="font-mono text-[9.5px] tracking-[0.12em]" style={{ color: COLORS.sidebarMuted }}>
            ENGINEERING ASSISTANT
          </span>
        </div>
        <span
          className="flex items-center gap-1.5 rounded-full border px-2.5 py-1"
          style={{ borderColor: "rgba(8,106,216,0.4)" }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: COLORS.accent, animation: "pulse 2s ease-in-out infinite" }}
          />
          <span className="font-mono text-[9px] tracking-[0.12em]" style={{ color: COLORS.accent }}>
            LIVE
          </span>
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
            style={{ color: COLORS.sidebarMuted }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4.5">
        {messages.map((m, i) => (
          <MessageBubble key={m.id} message={m} isLast={!thinking && i === messages.length - 1} onNavigate={onClose} />
        ))}
        {thinking && (
          <div className="flex items-center gap-2.5 px-0.5 py-1">
            <Equalizer height={14} color={COLORS.accent} />
            <span className="font-mono text-[10px] tracking-[0.1em]" style={{ color: COLORS.sidebarMuted }}>
              SEARCHING KNOWLEDGE BASE…
            </span>
          </div>
        )}
      </div>

      {showChips && (
        <div className="flex flex-col gap-1.5 px-5 pb-3">
          {SUGGESTIONS.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => ask(label)}
              className="rounded-[9px] border px-3 py-2.5 text-left text-xs transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.12)", color: COLORS.sidebarMuted2 }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2.5 border-t px-5 py-3.5" style={{ borderColor: COLORS.sidebarBorder }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") ask();
          }}
          placeholder="Ask the knowledge base…"
          className="flex-1 rounded-[9px] border px-3.5 py-2.5 text-[13px] outline-none"
          style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.14)", color: COLORS.sidebarFg2 }}
        />
        <button
          type="button"
          onClick={() => ask()}
          disabled={thinking}
          className="rounded-[9px] px-4 text-sm font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: COLORS.accent, color: "#FFFFFF" }}
        >
          Send
        </button>
      </div>
    </aside>
  );
}
