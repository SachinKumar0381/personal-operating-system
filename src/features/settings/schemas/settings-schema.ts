import { z } from "zod";

export const updateSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  timezone: z.string().optional(),
  weightUnit: z.enum(["kg", "lbs"]).optional(),
  notifications: z.boolean().optional(),
  weekStartsOn: z.enum(["monday", "sunday"]).optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
