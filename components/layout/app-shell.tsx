"use client";

import { MessageCircle, Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ChatTeaser } from "@/components/chat/chat-teaser";
import { COLORS } from "@/lib/theme";
import { SidebarNav } from "./sidebar-nav";

const DEFAULT_CHAT_WIDTH = 372;
const MIN_CHAT_WIDTH = 280;
const MAX_CHAT_WIDTH = 560;
const MOBILE_DRAWER_WIDTH = 280;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [desktopChatOpen, setDesktopChatOpen] = useState(false);

  function openChat() {
    setMobileChatOpen(true);
    setDesktopChatOpen(true);
  }

  function startResize(e: React.MouseEvent) {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = chatWidth;
    const prevCursor = document.body.style.cursor;
    const prevSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    function onMove(ev: MouseEvent) {
      const delta = startX - ev.clientX;
      setChatWidth(Math.min(MAX_CHAT_WIDTH, Math.max(MIN_CHAT_WIDTH, startWidth + delta)));
    }
    function onUp() {
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevSelect;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden md:flex-row" style={{ color: COLORS.ink2 }}>
      {/* Mobile top bar — replaces the sidebar rail below md */}
      <div
        className="flex shrink-0 items-center gap-3 border-b px-4 py-3 md:hidden"
        style={{ background: COLORS.sidebarBg, borderColor: COLORS.sidebarBorder }}
      >
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className="flex h-8 w-8 items-center justify-center rounded-md"
          style={{ color: COLORS.sidebarFg }}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Image src="/nca-logo.png" alt="NCA logo" width={24} height={24} className="shrink-0" priority />
        <span className="text-sm font-bold" style={{ color: COLORS.sidebarFg }}>
          NCA · ENG
        </span>
      </div>

      {/* Desktop sidebar rail */}
      <div className="hidden md:flex">
        <SidebarNav collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} />
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute inset-y-0 left-0 shadow-2xl" style={{ width: MOBILE_DRAWER_WIDTH }}>
            <SidebarNav collapsed={false} onToggleCollapsed={() => {}} onCloseMobile={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto" style={{ background: COLORS.contentBg }}>
        {children}
      </main>

      {/* Desktop resizable chat panel — hidden entirely (not just collapsed) when closed */}
      {desktopChatOpen && (
        <div className="hidden shrink-0 md:flex" style={{ width: chatWidth }}>
          <div
            onMouseDown={startResize}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize chat panel"
            className="relative w-[5px] shrink-0 cursor-col-resize"
            style={{ background: COLORS.sidebarBg }}
          >
            <div
              className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 transition-colors"
              style={{ background: "rgba(255,255,255,0.14)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.14)";
              }}
            />
          </div>
          <div className="h-full min-w-0 flex-1">
            <ChatPanel onClose={() => setDesktopChatOpen(false)} />
          </div>
        </div>
      )}

      {/* One-time nudge bubble — shows on mount on both mobile and desktop, fades after a few seconds */}
      {!mobileChatOpen && !desktopChatOpen && <ChatTeaser onOpen={openChat} />}

      {/* Chat FAB — always shown on mobile; shown on desktop only once the panel has been hidden */}
      <button
        type="button"
        onClick={openChat}
        aria-label="Open assistant"
        className={`fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg ${
          desktopChatOpen ? "md:hidden" : ""
        }`}
        style={{ background: COLORS.accent, color: "#FFFFFF" }}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Mobile full-screen chat overlay */}
      {mobileChatOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <ChatPanel onClose={() => setMobileChatOpen(false)} />
        </div>
      )}
    </div>
  );
}
