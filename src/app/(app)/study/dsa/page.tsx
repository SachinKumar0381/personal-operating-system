"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useDsaProblems } from "@/features/dsa-tracker/hooks/use-dsa-problems";
import { useDsaMutations } from "@/features/dsa-tracker/hooks/use-dsa-mutations";
import { DsaStats } from "@/features/dsa-tracker/components/dsa-stats";
import { DsaChart } from "@/features/dsa-tracker/components/dsa-chart";
import { DsaForm } from "@/features/dsa-tracker/components/dsa-form";
import { DsaTable } from "@/features/dsa-tracker/components/dsa-table";
import { DsaFiltersBar } from "@/features/dsa-tracker/components/dsa-filters";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import type { CreateDsaInput, UpdateDsaInput } from "@/features/dsa-tracker/schemas/dsa-schema";
import type { DsaProblem, DsaFilters, DsaStats as DsaStatsType } from "@/features/dsa-tracker/types";

const EMPTY_STATS: DsaStatsType = {
  total: 0,
  solved: 0,
  attempted: 0,
  revisit: 0,
  easy: 0,
  medium: 0,
  hard: 0,
  goal: 300,
  byCategory: [],
};

const DEFAULT_FILTERS: DsaFilters = {
  platform: "",
  difficulty: "",
  category: "",
  status: "",
  search: "",
};

export default function DsaPage(): React.ReactElement {
  const { data, isLoading } = useDsaProblems();
  const { addProblem, editProblem, removeProblem } = useDsaMutations();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<DsaProblem | null>(null);
  const [filters, setFilters] = useState<DsaFilters>(DEFAULT_FILTERS);

  const filteredProblems = useMemo(() => {
    const problems = data?.problems ?? [];
    return problems.filter((p) => {
      if (filters.platform && p.platform !== filters.platform) return false;
      if (filters.difficulty && p.difficulty !== filters.difficulty) return false;
      if (filters.category && p.category !== filters.category) return false;
      if (filters.status && p.status !== filters.status) return false;
      if (
        filters.search &&
        !p.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !p.notes?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [data?.problems, filters]);

  function handleAdd(input: CreateDsaInput) {
    addProblem.mutate(input, {
      onSuccess: () => setShowForm(false),
    });
  }

  function handleEdit(input: CreateDsaInput) {
    if (!editTarget) return;
    const updateData: UpdateDsaInput = {
      title: input.title,
      platform: input.platform,
      difficulty: input.difficulty,
      category: input.category,
      status: input.status,
      url: input.url,
      notes: input.notes,
      timeComplexity: input.timeComplexity,
      spaceComplexity: input.spaceComplexity,
    };
    editProblem.mutate(
      { id: editTarget.id, data: updateData },
      { onSuccess: () => setEditTarget(null) }
    );
  }

  function handleStartEdit(problem: DsaProblem) {
    setEditTarget(problem);
    setShowForm(false);
  }

  function handleCancelEdit() {
    setEditTarget(null);
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">DSA Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your Data Structures &amp; Algorithms problem-solving progress.
          </p>
        </div>
        <GlassButton
          variant={showForm ? "ghost" : "primary"}
          size="md"
          onClick={() => {
            setShowForm((v) => !v);
            setEditTarget(null);
          }}
          className="shrink-0 gap-2"
        >
          {showForm ? (
            <>
              <X size={15} /> Close
            </>
          ) : (
            <>
              <Plus size={15} /> Add Problem
            </>
          )}
        </GlassButton>
      </div>

      {isLoading ? (
        <GlassCard
          variant="elevated"
          padding="md"
          className="flex h-40 items-center justify-center"
        >
          <p className="text-sm text-muted-foreground">Loading…</p>
        </GlassCard>
      ) : (
        <>
          <DsaStats stats={data?.stats ?? EMPTY_STATS} />

          <DsaChart stats={data?.stats ?? EMPTY_STATS} />

          {(showForm || editTarget) && (
            <DsaForm
              onSubmit={editTarget ? handleEdit : handleAdd}
              onCancel={editTarget ? handleCancelEdit : () => setShowForm(false)}
              isLoading={addProblem.isPending || editProblem.isPending}
              editProblem={editTarget}
            />
          )}

          <DsaFiltersBar filters={filters} onChange={setFilters} />

          <DsaTable
            problems={filteredProblems}
            onEdit={handleStartEdit}
            onDelete={(id) => removeProblem.mutate(id)}
            isDeleting={removeProblem.isPending}
          />
        </>
      )}
    </motion.div>
  );
}
