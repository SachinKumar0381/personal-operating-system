"use client";

import { cn } from "@/shared/utils/cn";
import { TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from "../schemas/task-schema";
import type { TaskFiltersState } from "../types";

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onChange: (filters: TaskFiltersState) => void;
  taskCount: number;
}

function Chip({
  active,
  onClick,
  children,
  colorClass,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  colorClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150",
        active
          ? cn("border-transparent text-white shadow-sm", colorClass ?? "bg-primary")
          : "border-white/20 bg-white/10 text-muted-foreground hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10"
      )}
    >
      {children}
    </button>
  );
}

const PRIORITY_ACTIVE: Record<string, string> = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

const STATUS_ACTIVE: Record<string, string> = {
  todo: "bg-muted-foreground",
  in_progress: "bg-blue-500",
  done: "bg-green-500",
};

const STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export function TaskFilters({ filters, onChange, taskCount }: TaskFiltersProps): React.ReactElement {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
          Priority
        </span>
        <Chip
          active={filters.priority === "all"}
          onClick={() => onChange({ ...filters, priority: "all" })}
          colorClass="bg-primary"
        >
          All
        </Chip>
        {TASK_PRIORITIES.map((p) => (
          <Chip
            key={p}
            active={filters.priority === p}
            onClick={() => onChange({ ...filters, priority: p })}
            colorClass={PRIORITY_ACTIVE[p]}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Chip>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
          Status
        </span>
        <Chip
          active={filters.status === "all"}
          onClick={() => onChange({ ...filters, status: "all" })}
          colorClass="bg-primary"
        >
          All
        </Chip>
        {TASK_STATUSES.map((s) => (
          <Chip
            key={s}
            active={filters.status === s}
            onClick={() => onChange({ ...filters, status: s })}
            colorClass={STATUS_ACTIVE[s]}
          >
            {STATUS_LABELS[s]}
          </Chip>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
          Category
        </span>
        <Chip
          active={filters.category === "all"}
          onClick={() => onChange({ ...filters, category: "all" })}
          colorClass="bg-primary"
        >
          All
        </Chip>
        {TASK_CATEGORIES.map((c) => (
          <Chip
            key={c}
            active={filters.category === c}
            onClick={() => onChange({ ...filters, category: c })}
            colorClass="bg-primary"
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </Chip>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {taskCount} {taskCount === 1 ? "task" : "tasks"} shown
      </p>
    </div>
  );
}
