"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { QUERY_KEYS } from "@/shared/constants";
import type { UserSettingsData } from "@/features/settings/types";
import type { UpdateSettingsInput, ChangePasswordInput } from "@/features/settings/schemas/settings-schema";

async function fetchSettings(): Promise<UserSettingsData> {
  const res = await fetch("/api/settings");
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch settings");
  return json.data as UserSettingsData;
}

async function patchSettings(data: UpdateSettingsInput): Promise<UserSettingsData> {
  const res = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to update settings");
  return json.data as UserSettingsData;
}

async function patchPassword(data: ChangePasswordInput): Promise<void> {
  const res = await fetch("/api/settings/password", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to change password");
}

async function deleteAccount(): Promise<void> {
  const res = await fetch("/api/settings/account", { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete account");
}

export function useSettings() {
  return useQuery({
    queryKey: [QUERY_KEYS.SETTINGS],
    queryFn: fetchSettings,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchSettings,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.SETTINGS] });
      const previous = queryClient.getQueryData<UserSettingsData>([QUERY_KEYS.SETTINGS]);
      if (previous) {
        queryClient.setQueryData<UserSettingsData>([QUERY_KEYS.SETTINGS], {
          ...previous,
          ...newData,
        });
      }
      return { previous };
    },
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData([QUERY_KEYS.SETTINGS], context.previous);
      }
      toast.error("Failed to save settings");
    },
    onSuccess: () => {
      toast.success("Settings saved");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: patchPassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to change password");
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      toast.success("Account deleted");
      await signOut({ callbackUrl: "/login" });
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to delete account");
    },
  });
}
