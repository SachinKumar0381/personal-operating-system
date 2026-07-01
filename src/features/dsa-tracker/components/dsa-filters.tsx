"use client";

import { Search, X } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassInput } from "@/shared/ui/glass-input";
import { GlassButton } from "@/shared/ui/glass-button";
import { cn } from "@/shared/utils/cn";
import {
  DSA_PLATFORMS,
  DSA_DIFFICULTIES,
  DSA_CATEGORIES,
  DSA_STATUSES,
} from "@/features/dsa-tracker/schemas/dsa-schema";
import type { DsaFilters } from "@/features/dsa-tracker/types";

interface DsaFiltersProps {
  filters: DsaFilters;
  onChange: (filters: DsaFilters) => void;
}

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

function SelectField({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }) {
  return (
    <select
      className={cn(
        "h-8 rounded-lg px-2 py-1 text-xs",
        "bg-white/10 dark:bg-white/5 backdrop-blur-sm",
        "border border-white/20 dark:border-white/10",
        "text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
        "transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

const STATUS_LABELS: Record<string, string> = {
  solved: "Solved",
  attempted: "Attempted",
  revisit: "Revisit",
};

export function DsaFiltersBar({ filters, onChange }: DsaFiltersProps): React.ReactElement {
  const hasActive =
    filters.platform !== "" ||
    filters.difficulty !== "" ||
    filters.category !== "" ||
    filters.status !== "" ||
    filters.search !== "";

  function clear() {
    onChange({ platform: "", difficulty: "", category: "", status: "", search: "" });
  }

  return (
    <GlassCard variant="elevated" padding="md" className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <GlassInput
            placeholder="Search problems…"
            className="pl-8 h-9 text-xs"
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
        <span className="text-xs text-muted-foreground font-medium">Status:</span>
        <FilterChip
          label="All"
          active={filters.status === ""}
          onClick={() => onChange({ ...filters, status: "" })}
        />
        {DSA_STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={STATUS_LABELS[s] ?? s}
            active={filters.status === s}
            onClick={() => onChange({ ...filters, status: filters.status === s ? "" : s })}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">Difficulty:</span>
        <FilterChip
          label="All"
          active={filters.difficulty === ""}
          onClick={() => onChange({ ...filters, difficulty: "" })}
        />
        {DSA_DIFFICULTIES.map((d) => (
          <FilterChip
            key={d}
            label={d}
            active={filters.difficulty === d}
            onClick={() =>
              onChange({ ...filters, difficulty: filters.difficulty === d ? "" : d })
            }
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Platform:</span>
        <SelectField
          value={filters.platform}
          onChange={(e) => onChange({ ...filters, platform: e.target.value })}
        >
          <option value="">All platforms</option>
          {DSA_PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </SelectField>
        <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Category:</span>
        <SelectField
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
        >
          <option value="">All categories</option>
          {DSA_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </SelectField>
      </div>
    </GlassCard>
  );
}
