import bcrypt from "bcryptjs";
import { prisma } from "@/core/database";
import { AppError } from "@/core/errors";
import type { RegisterInput } from "@/features/auth/schemas/auth-schema";

export const authService = {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError("Email already in use", 409);

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return { id: user.id, email: user.email, name: user.name };
  },
};
