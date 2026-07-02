"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import { Label } from "@/shared/ui/label";
import { changePasswordSchema, type ChangePasswordInput } from "@/features/settings/schemas/settings-schema";
import { useChangePassword } from "@/features/settings/hooks/use-settings";

export function PasswordSettings(): React.ReactElement {
  const { mutate, isPending } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  function onSubmit(data: ChangePasswordInput): void {
    mutate(data, { onSuccess: () => reset() });
  }

  return (
    <GlassCard variant="default" padding="lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/15 text-green-500">
          <Lock size={18} />
        </div>
        <div>
          <h2 className="text-base font-semibold">Security</h2>
          <p className="text-xs text-muted-foreground">Change your account password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword" className="text-sm">
            Current Password
          </Label>
          <GlassInput
            id="currentPassword"
            type="password"
            placeholder="Enter current password"
            autoComplete="current-password"
            error={!!errors.currentPassword}
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="newPassword" className="text-sm">
            New Password
          </Label>
          <GlassInput
            id="newPassword"
            type="password"
            placeholder="Min 6 characters"
            autoComplete="new-password"
            error={!!errors.newPassword}
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-xs text-destructive">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmNewPassword" className="text-sm">
            Confirm New Password
          </Label>
          <GlassInput
            id="confirmNewPassword"
            type="password"
            placeholder="Repeat new password"
            autoComplete="new-password"
            error={!!errors.confirmNewPassword}
            {...register("confirmNewPassword")}
          />
          {errors.confirmNewPassword && (
            <p className="text-xs text-destructive">{errors.confirmNewPassword.message}</p>
          )}
        </div>

        <GlassButton type="submit" variant="primary" size="md" disabled={isPending}>
          {isPending ? "Changing…" : "Change Password"}
        </GlassButton>
      </form>
    </GlassCard>
  );
}
