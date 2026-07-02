"use client";

import { Skeleton } from "@/shared/ui/skeleton";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { ProfileSettings } from "@/features/settings/components/profile-settings";
import { AppearanceSettings } from "@/features/settings/components/appearance-settings";
import { PasswordSettings } from "@/features/settings/components/password-settings";
import { AccountSettings } from "@/features/settings/components/account-settings";

function SettingsSkeleton(): React.ReactElement {
  return (
    <div className="max-w-2xl space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-52 rounded-2xl" />
      ))}
    </div>
  );
}

export default function SettingsPage(): React.ReactElement {
  const { data: settings, isLoading, isError } = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, preferences, and account.
        </p>
      </div>

      {isLoading && <SettingsSkeleton />}

      {isError && (
        <p className="text-sm text-destructive">Failed to load settings. Please refresh.</p>
      )}

      {settings && (
        <div className="max-w-2xl space-y-4">
          <ProfileSettings key={settings.updatedAt} settings={settings} />
          <AppearanceSettings key={`appearance-${settings.updatedAt}`} settings={settings} />
          <PasswordSettings />
          <AccountSettings />
        </div>
      )}
    </div>
  );
}
