import { prisma } from "@/core/database";
import { NotFoundError, ForbiddenError } from "@/core/errors";
import type { CreateSdInput, UpdateSdInput } from "@/features/system-design-tracker/schemas/sd-schema";
import type { SystemDesignTopic, SdStats } from "@/features/system-design-tracker/types";
import type { SystemDesignTopic as PrismaSdTopic } from "@prisma/client";

function serialize(t: PrismaSdTopic): SystemDesignTopic {
  return {
    id: t.id,
    userId: t.userId,
    title: t.title,
    status: t.status as SystemDesignTopic["status"],
    concepts: t.concepts,
    notes: t.notes ?? null,
    resources: t.resources,
    completedAt: t.completedAt ? t.completedAt.toISOString() : null,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

export const sdService = {
  async getTopics(userId: string): Promise<SystemDesignTopic[]> {
    const topics = await prisma.systemDesignTopic.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return topics.map(serialize);
  },

  async getStats(userId: string): Promise<SdStats> {
    const all = await prisma.systemDesignTopic.findMany({ where: { userId } });

    const notStarted = all.filter((t) => t.status === "not_started").length;
    const inProgress = all.filter((t) => t.status === "in_progress").length;
    const completed = all.filter((t) => t.status === "completed").length;
    const needsRevision = all.filter((t) => t.status === "needs_revision").length;
    const total = all.length;
    const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, notStarted, inProgress, completed, needsRevision, completionPct };
  },

  async createTopic(userId: string, data: CreateSdInput): Promise<SystemDesignTopic> {
    const topic = await prisma.systemDesignTopic.create({
      data: {
        userId,
        title: data.title,
        status: data.status,
        concepts: data.concepts ?? [],
        notes: data.notes ?? null,
        resources: data.resources ?? [],
        completedAt: data.status === "completed" ? new Date() : null,
      },
    });
    return serialize(topic);
  },

  async updateTopic(userId: string, id: string, data: UpdateSdInput): Promise<SystemDesignTopic> {
    const existing = await prisma.systemDesignTopic.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Topic");
    if (existing.userId !== userId) throw new ForbiddenError();

    const wasCompleted = existing.status === "completed";
    const nowCompleted = data.status === "completed";

    const topic = await prisma.systemDesignTopic.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.concepts !== undefined && { concepts: data.concepts }),
        ...(data.notes !== undefined && { notes: data.notes ?? null }),
        ...(data.resources !== undefined && { resources: data.resources }),
        ...(!wasCompleted && nowCompleted ? { completedAt: new Date() } : {}),
        ...(wasCompleted && !nowCompleted ? { completedAt: null } : {}),
      },
    });
    return serialize(topic);
  },

  async deleteTopic(userId: string, id: string): Promise<void> {
    const existing = await prisma.systemDesignTopic.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Topic");
    if (existing.userId !== userId) throw new ForbiddenError();
    await prisma.systemDesignTopic.delete({ where: { id } });
  },
};
