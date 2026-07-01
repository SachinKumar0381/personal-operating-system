import { prisma } from "@/core/database";
import { NotFoundError, ForbiddenError } from "@/core/errors";
import type { CreateDsaInput, UpdateDsaInput } from "@/features/dsa-tracker/schemas/dsa-schema";
import { DSA_GOAL } from "@/features/dsa-tracker/schemas/dsa-schema";
import type { DsaProblem, DsaStats, CategoryStat } from "@/features/dsa-tracker/types";
import type { DsaProblem as PrismaDsaProblem } from "@prisma/client";

function serialize(p: PrismaDsaProblem): DsaProblem {
  return {
    id: p.id,
    userId: p.userId,
    title: p.title,
    platform: p.platform as DsaProblem["platform"],
    difficulty: p.difficulty as DsaProblem["difficulty"],
    category: p.category as DsaProblem["category"],
    status: p.status as DsaProblem["status"],
    url: p.url ?? null,
    notes: p.notes ?? null,
    timeComplexity: p.timeComplexity ?? null,
    spaceComplexity: p.spaceComplexity ?? null,
    solvedAt: p.solvedAt ? p.solvedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export const dsaService = {
  async getProblems(userId: string): Promise<DsaProblem[]> {
    const problems = await prisma.dsaProblem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return problems.map(serialize);
  },

  async getStats(userId: string): Promise<DsaStats> {
    const all = await prisma.dsaProblem.findMany({ where: { userId } });

    const solved = all.filter((p) => p.status === "solved").length;
    const attempted = all.filter((p) => p.status === "attempted").length;
    const revisit = all.filter((p) => p.status === "revisit").length;
    const easy = all.filter((p) => p.difficulty === "Easy").length;
    const medium = all.filter((p) => p.difficulty === "Medium").length;
    const hard = all.filter((p) => p.difficulty === "Hard").length;

    const categoryMap = new Map<string, number>();
    for (const p of all) {
      categoryMap.set(p.category, (categoryMap.get(p.category) ?? 0) + 1);
    }
    const byCategory: CategoryStat[] = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      total: all.length,
      solved,
      attempted,
      revisit,
      easy,
      medium,
      hard,
      goal: DSA_GOAL,
      byCategory,
    };
  },

  async createProblem(userId: string, data: CreateDsaInput): Promise<DsaProblem> {
    const problem = await prisma.dsaProblem.create({
      data: {
        userId,
        title: data.title,
        platform: data.platform,
        difficulty: data.difficulty,
        category: data.category,
        status: data.status,
        url: data.url || null,
        notes: data.notes ?? null,
        timeComplexity: data.timeComplexity ?? null,
        spaceComplexity: data.spaceComplexity ?? null,
        solvedAt: data.status === "solved" ? new Date() : null,
      },
    });
    return serialize(problem);
  },

  async updateProblem(userId: string, id: string, data: UpdateDsaInput): Promise<DsaProblem> {
    const existing = await prisma.dsaProblem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Problem");
    if (existing.userId !== userId) throw new ForbiddenError();

    const wasSolved = existing.status === "solved";
    const nowSolved = data.status === "solved";

    const problem = await prisma.dsaProblem.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.platform !== undefined && { platform: data.platform }),
        ...(data.difficulty !== undefined && { difficulty: data.difficulty }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.url !== undefined && { url: data.url || null }),
        ...(data.notes !== undefined && { notes: data.notes ?? null }),
        ...(data.timeComplexity !== undefined && { timeComplexity: data.timeComplexity ?? null }),
        ...(data.spaceComplexity !== undefined && { spaceComplexity: data.spaceComplexity ?? null }),
        ...(!wasSolved && nowSolved ? { solvedAt: new Date() } : {}),
        ...(wasSolved && !nowSolved ? { solvedAt: null } : {}),
      },
    });
    return serialize(problem);
  },

  async deleteProblem(userId: string, id: string): Promise<void> {
    const existing = await prisma.dsaProblem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Problem");
    if (existing.userId !== userId) throw new ForbiddenError();
    await prisma.dsaProblem.delete({ where: { id } });
  },
};
