"use client";

import { Search, X } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassInput } from "@/shared/ui/glass-input";
import { GlassButton } from "@/shared/ui/glass-button";
import { cn } from "@/shared/utils/cn";
import type { SdFilters } from "@/features/system-design-tracker/types";

interface SdFiltersBarProps {
  filters: SdFilters;
  onChange: (filters: SdFilters) => void;
}

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "needs_revision", label: "Needs Revision" },
];

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-all duration-150",
        active
          ? "bg-primary/90 text-primary-foreground shadow-sm"
          : "bg-white/10 dark:bg-white/5 text-muted-foreground hover:bg-white/20 dark:hover:bg-white/10 border border-white/15 dark:border-white/10"
      )}
    >
      {label}
    </button>
  );
}

export function SdFiltersBar({ filters, onChange }: SdFiltersBarProps): React.ReactElement {
  const hasActive = filters.status !== "" || filters.search !== "";

  function clear() {
    onChange({ status: "", search: "" });
  }

  return (
    <GlassCard variant="elevated" padding="md" className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <GlassInput
            placeholder="Search topics…"
            className="h-9 pl-8 text-xs"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
          />
        </div>
        {hasActive && (
          <GlassButton size="sm" variant="ghost" onClick={clear} className="h-9 gap-1 text-xs">
            <X size={12} />
            Clear
          </GlassButton>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">Status:</span>
        {STATUS_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            active={filters.status === opt.value}
            onClick={() => onChange({ ...filters, status: opt.value })}
          />
        ))}
      </div>
    </GlassCard>
  );
}
