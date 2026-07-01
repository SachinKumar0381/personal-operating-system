import { prisma } from "@/core/database";
import { NotFoundError, ForbiddenError } from "@/core/errors";
import type { CreateResumeInput, UpdateResumeInput } from "@/features/resume-versions/schemas/resume-schema";
import type { ResumeVersion, ResumeStats } from "@/features/resume-versions/types";
import type { ResumeVersion as PrismaResume } from "@prisma/client";

function serialize(r: PrismaResume): ResumeVersion {
  return {
    id: r.id,
    userId: r.userId,
    version: r.version,
    fileUrl: r.fileUrl ?? null,
    notes: r.notes ?? null,
    isActive: r.isActive,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export const resumeService = {
  async getVersions(userId: string): Promise<ResumeVersion[]> {
    const versions = await prisma.resumeVersion.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return versions.map(serialize);
  },

  async getStats(userId: string): Promise<ResumeStats> {
    const versions = await prisma.resumeVersion.findMany({ where: { userId } });
    const active = versions.find((v) => v.isActive);
    return {
      total: versions.length,
      hasActive: !!active,
      activeVersion: active?.version ?? null,
    };
  },

  async createVersion(userId: string, data: CreateResumeInput): Promise<ResumeVersion> {
    const version = await prisma.resumeVersion.create({
      data: {
        userId,
        version: data.version,
        fileUrl: data.fileUrl || null,
        notes: data.notes ?? null,
        isActive: data.isActive === true,
      },
    });
    return serialize(version);
  },

  async updateVersion(
    userId: string,
    id: string,
    data: UpdateResumeInput
  ): Promise<ResumeVersion> {
    const existing = await prisma.resumeVersion.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Resume version");
    if (existing.userId !== userId) throw new ForbiddenError();

    const version = await prisma.resumeVersion.update({
      where: { id },
      data: {
        ...(data.version !== undefined && { version: data.version }),
        ...(data.fileUrl !== undefined && { fileUrl: data.fileUrl || null }),
        ...(data.notes !== undefined && { notes: data.notes ?? null }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
    return serialize(version);
  },

  async setActive(userId: string, id: string): Promise<ResumeVersion> {
    const existing = await prisma.resumeVersion.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Resume version");
    if (existing.userId !== userId) throw new ForbiddenError();

    // Deactivate all, then activate the target
    await prisma.resumeVersion.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    const version = await prisma.resumeVersion.update({
      where: { id },
      data: { isActive: true },
    });
    return serialize(version);
  },

  async deleteVersion(userId: string, id: string): Promise<void> {
    const existing = await prisma.resumeVersion.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Resume version");
    if (existing.userId !== userId) throw new ForbiddenError();
    await prisma.resumeVersion.delete({ where: { id } });
  },
};
