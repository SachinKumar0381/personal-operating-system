"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { format } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassBadge } from "@/shared/ui/glass-badge";
import { cn } from "@/shared/utils/cn";
import type { FinanceEntry, FinanceType } from "@/features/finance-tracker/types";

interface FinanceListProps {
  entries: FinanceEntry[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const TYPE_ICON: Record<FinanceType, React.ReactNode> = {
  income: <TrendingUp size={14} />,
  expense: <TrendingDown size={14} />,
  saving: <PiggyBank size={14} />,
};

const TYPE_COLOR: Record<
  FinanceType,
  "success" | "destructive" | "primary"
> = {
  income: "success",
  expense: "destructive",
  saving: "primary",
};

const TYPE_ICON_BG: Record<FinanceType, string> = {
  income: "bg-green-500/15 text-green-500",
  expense: "bg-red-500/15 text-red-500",
  saving: "bg-blue-500/15 text-blue-500",
};

type FilterType = "all" | FinanceType;

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
  { label: "Saving", value: "saving" },
];

export function FinanceList({
  entries,
  onDelete,
  isDeleting,
}: FinanceListProps): React.ReactElement {
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = filter === "all" ? entries : entries.filter((e) => e.type === filter);

  const formatAmount = (amount: number, currency: string): string => {
    const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";
    return `${symbol}${amount.toLocaleString("en-IN")}`;
  };

  return (
    <GlassCard variant="elevated" padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm font-medium">Transactions</p>
        <span className="text-xs text-muted-foreground">{filtered.length} entries</span>
      </div>

      <div className="flex gap-1.5 px-4 pb-3">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150",
              filter === value
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-white/10 dark:hover:bg-white/5"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <Wallet size={32} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/10 max-h-[480px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {filtered.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center gap-3 px-4 py-3"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    TYPE_ICON_BG[entry.type]
                  )}
                >
                  {TYPE_ICON[entry.type]}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{entry.category}</p>
                    <GlassBadge variant={TYPE_COLOR[entry.type]} className="shrink-0">
                      {entry.type}
                    </GlassBadge>
                  </div>
                  {entry.description && (
                    <p className="truncate text-xs text-muted-foreground">{entry.description}</p>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <p
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      entry.type === "income" && "text-green-500",
                      entry.type === "expense" && "text-red-500",
                      entry.type === "saving" && "text-blue-500"
                    )}
                  >
                    {entry.type === "income" ? "+" : "-"}
                    {formatAmount(entry.amount, entry.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(entry.date), "d MMM yyyy")}
                  </p>
                </div>

                <GlassButton
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  onClick={() => onDelete(entry.id)}
                  disabled={isDeleting}
                  aria-label="Delete transaction"
                >
                  <Trash2 size={13} />
                </GlassButton>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </GlassCard>
  );
}
