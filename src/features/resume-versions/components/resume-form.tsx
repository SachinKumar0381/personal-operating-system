"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import { createResumeSchema, type CreateResumeInput } from "@/features/resume-versions/schemas/resume-schema";
import type { ResumeVersion } from "@/features/resume-versions/types";

interface ResumeFormProps {
  defaultValues?: Partial<ResumeVersion>;
  onSubmit: (data: CreateResumeInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ResumeForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}: ResumeFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateResumeInput>({
    resolver: zodResolver(createResumeSchema),
    defaultValues: {
      version: defaultValues?.version ?? "",
      fileUrl: defaultValues?.fileUrl ?? "",
      notes: defaultValues?.notes ?? "",
      isActive: defaultValues?.isActive ?? false,
    },
  });

  useEffect(() => {
    reset({
      version: defaultValues?.version ?? "",
      fileUrl: defaultValues?.fileUrl ?? "",
      notes: defaultValues?.notes ?? "",
      isActive: defaultValues?.isActive ?? false,
    });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Version Name *</label>
        <GlassInput
          {...register("version")}
          placeholder="e.g. v3.0 — SWE Focus, Jan 2025"
          error={!!errors.version}
        />
        {errors.version && (
          <p className="text-xs text-destructive">{errors.version.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">File URL (optional)</label>
        <GlassInput
          {...register("fileUrl")}
          placeholder="https://drive.google.com/..."
          error={!!errors.fileUrl}
        />
        {errors.fileUrl && (
          <p className="text-xs text-destructive">{errors.fileUrl.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Paste a Google Drive, Dropbox, or any public link. File upload available in a future update.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Notes (optional)</label>
        <textarea
          {...register("notes")}
          placeholder="What's different about this version? Tailored for which role/company?"
          rows={3}
          className="flex w-full rounded-xl px-3 py-2 text-sm bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          type="checkbox"
          {...register("isActive")}
          className="h-4 w-4 rounded border-white/20 bg-white/10 accent-primary"
        />
        <label htmlFor="isActive" className="text-sm text-muted-foreground">
          Set as active resume
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <GlassButton
          type="submit"
          variant="primary"
          size="md"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? "Saving…" : defaultValues?.id ? "Save Changes" : "Add Version"}
        </GlassButton>
        <GlassButton type="button" variant="ghost" size="md" onClick={onCancel}>
          Cancel
        </GlassButton>
      </div>
    </form>
  );
}
