"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import { Label } from "@/shared/ui/label";
import { updateSettingsSchema, type UpdateSettingsInput } from "@/features/settings/schemas/settings-schema";
import { useUpdateSettings } from "@/features/settings/hooks/use-settings";
import type { UserSettingsData } from "@/features/settings/types";

interface ProfileSettingsProps {
  settings: UserSettingsData;
}

// Rendered with key={settings.updatedAt} from parent — remounts when settings change
export function ProfileSettings({ settings }: ProfileSettingsProps): React.ReactElement {
  const { mutate, isPending } = useUpdateSettings();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Pick<UpdateSettingsInput, "name">>({
    resolver: zodResolver(updateSettingsSchema.pick({ name: true })),
    defaultValues: { name: settings.name ?? "" },
  });

  function onSubmit(data: Pick<UpdateSettingsInput, "name">): void {
    mutate({ name: data.name });
  }

  return (
    <GlassCard variant="default" padding="lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500">
          <User size={18} />
        </div>
        <div>
          <h2 className="text-base font-semibold">Profile</h2>
          <p className="text-xs text-muted-foreground">Update your display name</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm">
            Display Name
          </Label>
          <GlassInput
            id="name"
            placeholder="Your name"
            error={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Email</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Email address cannot be changed.
          </p>
        </div>

        <GlassButton
          type="submit"
          variant="primary"
          size="md"
          disabled={!isDirty || isPending}
        >
          {isPending ? "Saving…" : "Save Name"}
        </GlassButton>
      </form>
    </GlassCard>
  );
}
