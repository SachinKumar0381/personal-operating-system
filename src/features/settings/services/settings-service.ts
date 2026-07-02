import bcrypt from "bcryptjs";
import { prisma } from "@/core/database";
import { AppError, NotFoundError } from "@/core/errors";
import type { UpdateSettingsInput } from "@/features/settings/schemas/settings-schema";
import type { UserSettingsData } from "@/features/settings/types";
import type { UserSettings } from "@prisma/client";

function serialize(settings: UserSettings, name: string | null): UserSettingsData {
  return {
    id: settings.id,
    userId: settings.userId,
    name,
    theme: settings.theme,
    timezone: settings.timezone,
    weightUnit: settings.weightUnit,
    notifications: settings.notifications,
    weekStartsOn: settings.weekStartsOn,
    createdAt: settings.createdAt.toISOString(),
    updatedAt: settings.updatedAt.toISOString(),
  };
}

export const settingsService = {
  async getSettings(userId: string): Promise<UserSettingsData> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });
    if (!user) throw new NotFoundError("User");

    const settings =
      user.settings ??
      (await prisma.userSettings.create({ data: { userId } }));

    return serialize(settings, user.name ?? null);
  },

  async updateSettings(userId: string, data: UpdateSettingsInput): Promise<UserSettingsData> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User");

    const { name, ...settingsFields } = data;

    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId },
      create: { userId, ...settingsFields },
      update: settingsFields,
    });

    let resolvedName = user.name ?? null;
    if (name !== undefined) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
      resolvedName = updatedUser.name ?? null;
    }

    return serialize(updatedSettings, resolvedName);
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) throw new NotFoundError("User");

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new AppError("Current password is incorrect", 400);

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  },

  async deleteAccount(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User");
    await prisma.user.delete({ where: { id: userId } });
  },
};
