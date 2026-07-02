"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Palette } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { updateSettingsSchema, type UpdateSettingsInput } from "@/features/settings/schemas/settings-schema";
import { useUpdateSettings } from "@/features/settings/hooks/use-settings";
import { TIMEZONES } from "@/features/settings/constants";
import type { UserSettingsData } from "@/features/settings/types";

interface AppearanceSettingsProps {
  settings: UserSettingsData;
}

type AppearanceFields = Pick<
  UpdateSettingsInput,
  "theme" | "weightUnit" | "timezone" | "weekStartsOn" | "notifications"
>;

const appearanceSchema = updateSettingsSchema.pick({
  theme: true,
  weightUnit: true,
  timezone: true,
  weekStartsOn: true,
  notifications: true,
});

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

function SegmentButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-all duration-200",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5"
      )}
    >
      {children}
    </button>
  );
}

// Rendered with key={settings.updatedAt} from parent — remounts when settings change
export function AppearanceSettings({ settings }: AppearanceSettingsProps): React.ReactElement {
  const { setTheme } = useTheme();
  const { mutate, isPending } = useUpdateSettings();

  const [themeValue, setThemeValue] = useState<"light" | "dark" | "system">(
    (settings.theme as "light" | "dark" | "system") ?? "system"
  );
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">(
    (settings.weightUnit as "kg" | "lbs") ?? "kg"
  );
  const [weekStartsOn, setWeekStartsOn] = useState<"monday" | "sunday">(
    (settings.weekStartsOn as "monday" | "sunday") ?? "monday"
  );
  const [notifications, setNotifications] = useState<boolean>(
    settings.notifications ?? true
  );

  const { control, handleSubmit, setValue } = useForm<AppearanceFields>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: themeValue,
      weightUnit,
      timezone: settings.timezone ?? "Asia/Kolkata",
      weekStartsOn,
      notifications,
    },
  });

  function handleThemeChange(value: "light" | "dark" | "system"): void {
    setThemeValue(value);
    setValue("theme", value);
    setTheme(value);
  }

  function handleWeightUnitChange(value: "kg" | "lbs"): void {
    setWeightUnit(value);
    setValue("weightUnit", value);
  }

  function handleWeekStartChange(value: "monday" | "sunday"): void {
    setWeekStartsOn(value);
    setValue("weekStartsOn", value);
  }

  function handleNotificationsChange(value: boolean): void {
    setNotifications(value);
    setValue("notifications", value);
  }

  function onSubmit(data: AppearanceFields): void {
    mutate(data);
  }

  return (
    <GlassCard variant="default" padding="lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-500">
          <Palette size={18} />
        </div>
        <div>
          <h2 className="text-base font-semibold">Preferences</h2>
          <p className="text-xs text-muted-foreground">Theme, units, and regional settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Theme */}
        <div className="space-y-2">
          <Label className="text-sm">Appearance</Label>
          <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <SegmentButton
                key={value}
                active={themeValue === value}
                onClick={() => handleThemeChange(value)}
              >
                <Icon size={12} />
                {label}
              </SegmentButton>
            ))}
          </div>
        </div>

        {/* Weight Unit */}
        <div className="space-y-2">
          <Label className="text-sm">Weight Unit</Label>
          <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
            {(["kg", "lbs"] as const).map((unit) => (
              <SegmentButton
                key={unit}
                active={weightUnit === unit}
                onClick={() => handleWeightUnitChange(unit)}
              >
                {unit}
              </SegmentButton>
            ))}
          </div>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <Label className="text-sm">Timezone</Label>
          <Controller
            control={control}
            name="timezone"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full max-w-xs glass border-white/20 dark:border-white/10">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Week Starts On */}
        <div className="space-y-2">
          <Label className="text-sm">Week Starts On</Label>
          <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
            {(["monday", "sunday"] as const).map((day) => (
              <SegmentButton
                key={day}
                active={weekStartsOn === day}
                onClick={() => handleWeekStartChange(day)}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </SegmentButton>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-2">
          <Label className="text-sm">Notifications</Label>
          <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
            {([true, false] as const).map((val) => (
              <SegmentButton
                key={String(val)}
                active={notifications === val}
                onClick={() => handleNotificationsChange(val)}
              >
                {val ? "Enabled" : "Disabled"}
              </SegmentButton>
            ))}
          </div>
        </div>

        <GlassButton type="submit" variant="primary" size="md" disabled={isPending}>
          {isPending ? "Saving…" : "Save Preferences"}
        </GlassButton>
      </form>
    </GlassCard>
  );
}
