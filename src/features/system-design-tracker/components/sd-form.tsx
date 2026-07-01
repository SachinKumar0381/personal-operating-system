"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import { cn } from "@/shared/utils/cn";
import {
  createSdSchema,
  SD_STATUSES,
  SD_CONCEPTS,
  type CreateSdInput,
} from "@/features/system-design-tracker/schemas/sd-schema";
import type { SystemDesignTopic } from "@/features/system-design-tracker/types";

interface SdFormProps {
  onSubmit: (data: CreateSdInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  editTopic?: SystemDesignTopic | null;
}

const STATUS_LABELS: Record<string, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
  needs_revision: "Needs Revision",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{children}</label>
  );
}

function SelectField({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }) {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-xl px-3 py-2 text-sm",
        "bg-white/10 dark:bg-white/5 backdrop-blur-sm",
        "border border-white/20 dark:border-white/10",
        "text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
        "transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

function TextareaField({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return (
    <textarea
      rows={3}
      className={cn(
        "flex w-full rounded-xl px-3 py-2 text-sm",
        "bg-white/10 dark:bg-white/5 backdrop-blur-sm",
        "border border-white/20 dark:border-white/10",
        "text-foreground placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        "resize-none transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

export function SdForm({ onSubmit, onCancel, isLoading, editTopic }: SdFormProps): React.ReactElement {
  const isEditing = !!editTopic;

  const [concepts, setConcepts] = useState<string[]>(editTopic?.concepts ?? []);
  const [resources, setResources] = useState<string[]>(
    editTopic && editTopic.resources.length > 0 ? editTopic.resources : [""]
  );
  const [customInput, setCustomInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSdInput>({
    resolver: zodResolver(createSdSchema),
    defaultValues: {
      title: editTopic?.title ?? "",
      status: editTopic?.status ?? "not_started",
      notes: editTopic?.notes ?? "",
      concepts: [],
      resources: [],
    },
  });

  useEffect(() => {
    reset({
      title: editTopic?.title ?? "",
      status: editTopic?.status ?? "not_started",
      notes: editTopic?.notes ?? "",
      concepts: [],
      resources: [],
    });
  }, [editTopic, reset]);

  function toggleConcept(concept: string) {
    setConcepts((prev) =>
      prev.includes(concept) ? prev.filter((c) => c !== concept) : [...prev, concept]
    );
  }

  function addCustomConcept() {
    const trimmed = customInput.trim();
    if (trimmed && !concepts.includes(trimmed)) {
      setConcepts((prev) => [...prev, trimmed]);
    }
    setCustomInput("");
  }

  function removeCustomConcept(concept: string) {
    setConcepts((prev) => prev.filter((c) => c !== concept));
  }

  function updateResource(index: number, value: string) {
    setResources((prev) => prev.map((r, i) => (i === index ? value : r)));
  }

  function addResource() {
    setResources((prev) => [...prev, ""]);
  }

  function removeResource(index: number) {
    setResources((prev) => prev.filter((_, i) => i !== index));
  }

  function handleFormSubmit(data: CreateSdInput) {
    const cleanResources = resources.filter((r) => r.trim() !== "");
    onSubmit({ ...data, concepts, resources: cleanResources });
    if (!isEditing) {
      reset({ title: "", status: "not_started", notes: "", concepts: [], resources: [] });
      setConcepts([]);
      setResources([""]);
    }
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium">{isEditing ? "Edit Topic" : "Add Topic"}</p>
        {onCancel && (
          <GlassButton size="icon" variant="ghost" onClick={onCancel} className="h-7 w-7">
            <X size={14} />
          </GlassButton>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <FieldLabel>Topic Title *</FieldLabel>
          <GlassInput
            placeholder="e.g. Design Twitter"
            error={!!errors.title}
            {...register("title")}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div>
          <FieldLabel>Status *</FieldLabel>
          <SelectField {...register("status")}>
            {SD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </SelectField>
        </div>

        <div>
          <FieldLabel>Concepts Covered</FieldLabel>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {SD_CONCEPTS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleConcept(c)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-150",
                  concepts.includes(c)
                    ? "border-primary/50 bg-primary/90 text-primary-foreground shadow-sm"
                    : "border-white/15 bg-white/10 text-muted-foreground hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <GlassInput
              placeholder="Add custom concept…"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomConcept();
                }
              }}
              className="h-8 text-xs"
            />
            <GlassButton
              type="button"
              size="sm"
              variant="ghost"
              onClick={addCustomConcept}
              className="h-8 shrink-0"
            >
              <Plus size={13} />
            </GlassButton>
          </div>
          {concepts.filter((c) => !SD_CONCEPTS.includes(c as (typeof SD_CONCEPTS)[number])).length >
            0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {concepts
                .filter((c) => !SD_CONCEPTS.includes(c as (typeof SD_CONCEPTS)[number]))
                .map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => removeCustomConcept(c)}
                      className="hover:text-destructive"
                    >
                      <X size={9} />
                    </button>
                  </span>
                ))}
            </div>
          )}
        </div>

        <div>
          <FieldLabel>Notes</FieldLabel>
          <TextareaField
            placeholder="Key concepts, approach, what you learned..."
            {...register("notes")}
          />
        </div>

        <div>
          <FieldLabel>Resources (URLs)</FieldLabel>
          <div className="space-y-2">
            {resources.map((r, i) => (
              <div key={i} className="flex gap-2">
                <GlassInput
                  placeholder="https://..."
                  value={r}
                  onChange={(e) => updateResource(i, e.target.value)}
                  className="text-xs"
                />
                {resources.length > 1 && (
                  <GlassButton
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 shrink-0 hover:text-destructive"
                    onClick={() => removeResource(i)}
                  >
                    <X size={13} />
                  </GlassButton>
                )}
              </div>
            ))}
            <GlassButton
              type="button"
              size="sm"
              variant="ghost"
              onClick={addResource}
              className="h-8 gap-1.5 text-xs"
            >
              <Plus size={12} /> Add resource
            </GlassButton>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <GlassButton type="submit" variant="primary" className="flex-1" disabled={isLoading}>
            {isLoading ? "Saving…" : isEditing ? "Update Topic" : "Add Topic"}
          </GlassButton>
          {onCancel && (
            <GlassButton type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </GlassButton>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
