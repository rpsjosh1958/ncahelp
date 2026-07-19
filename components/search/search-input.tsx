"use client";

import { Search, X } from "lucide-react";
import { COLORS } from "@/lib/theme";

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: COLORS.faint }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border bg-white py-2.5 pl-10 pr-9 text-[13.5px] outline-none transition-colors"
        style={{ borderColor: COLORS.border, color: COLORS.ink2 }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = COLORS.accent;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = COLORS.border;
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full"
          style={{ color: COLORS.faint }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
