"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useRef, useState } from "react";
import { answerQuery, type DeskLink } from "@/lib/ai/answer-query";

export interface DeskMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  items?: string[];
  link?: DeskLink;
}

interface DeskChatContextValue {
  messages: DeskMessage[];
  input: string;
  setInput: (value: string) => void;
  thinking: boolean;
  ask: (query?: string) => void;
  openLink: (link: DeskLink | undefined) => void;
}

const DeskChatContext = createContext<DeskChatContextValue | null>(null);

const GREETING: DeskMessage = {
  id: "greeting",
  role: "ai",
  text: `Afternoon, I answer from the Engineering knowledge base: walkthroughs, letter templates, and who approves what across BMC, Mobile, Broadcasting and Satellite. Ask me anything.`,
};

function linkHref(link: DeskLink): string {
  switch (link.type) {
    case "walkthrough":
      return `/walkthroughs/${link.id}`;
    case "letter":
      return `/letters/${link.id}`;
    case "approvals":
      return "/approvals";
  }
}

export function DeskChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<DeskMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  function ask(raw?: string) {
    const query = (raw ?? input).trim();
    if (!query || thinking) return;

    setMessages((prev) => [...prev, { id: `u-${prev.length}`, role: "user", text: query }]);
    setInput("");
    setThinking(true);

    if (pendingRef.current) clearTimeout(pendingRef.current);
    const delay = 700 + Math.random() * 700;
    pendingRef.current = setTimeout(async () => {
      const answer = await answerQuery(query);
      setMessages((prev) => [...prev, { id: `a-${prev.length}`, role: "ai", ...answer }]);
      setThinking(false);
    }, delay);
  }

  function openLink(link: DeskLink | undefined) {
    if (!link) return;
    router.push(linkHref(link));
  }

  return (
    <DeskChatContext.Provider value={{ messages, input, setInput, thinking, ask, openLink }}>
      {children}
    </DeskChatContext.Provider>
  );
}

export function useDeskChat(): DeskChatContextValue {
  const ctx = useContext(DeskChatContext);
  if (!ctx) throw new Error("useDeskChat must be used within a DeskChatProvider");
  return ctx;
}
;
