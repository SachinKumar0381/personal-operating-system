import { prisma } from "@/core/database";
import { NotFoundError, ForbiddenError } from "@/core/errors";
import type { CreateJobInput, UpdateJobInput, CreateInterviewInput } from "@/features/job-tracker/schemas/job-schema";
import type { JobApplication, JobStats, JobStatus, InterviewRound } from "@/features/job-tracker/types";
import type {
  JobApplication as PrismaJob,
  InterviewRound as PrismaRound,
} from "@prisma/client";

function serializeRound(r: PrismaRound): InterviewRound {
  return {
    id: r.id,
    applicationId: r.applicationId,
    round: r.round,
    scheduledAt: r.scheduledAt ? r.scheduledAt.toISOString() : null,
    outcome: r.outcome ?? null,
    notes: r.notes ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

function serializeJob(
  job: PrismaJob & { interviewRounds: PrismaRound[] }
): JobApplication {
  return {
    id: job.id,
    userId: job.userId,
    company: job.company,
    role: job.role,
    status: job.status as JobStatus,
    salaryRange: job.salaryRange ?? null,
    jobUrl: job.jobUrl ?? null,
    notes: job.notes ?? null,
    appliedAt: job.appliedAt.toISOString(),
    followUpAt: job.followUpAt ? job.followUpAt.toISOString() : null,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    interviewRounds: job.interviewRounds.map(serializeRound),
  };
}

export const jobService = {
  async getApplications(userId: string): Promise<JobApplication[]> {
    const jobs = await prisma.jobApplication.findMany({
      where: { userId },
      include: { interviewRounds: { orderBy: { createdAt: "asc" } } },
      orderBy: { appliedAt: "desc" },
    });
    return jobs.map(serializeJob);
  },

  async getStats(userId: string): Promise<JobStats> {
    const jobs = await prisma.jobApplication.findMany({ where: { userId } });

    const activeStatuses: JobStatus[] = ["applied", "screening", "interview"];
    const active = jobs.filter((j) => activeStatuses.includes(j.status as JobStatus)).length;
    const offers = jobs.filter((j) => j.status === "offer").length;
    const rejected = jobs.filter((j) => j.status === "rejected").length;

    const statusMap = new Map<string, number>();
    for (const j of jobs) {
      statusMap.set(j.status, (statusMap.get(j.status) ?? 0) + 1);
    }
    const byStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
      status: status as JobStatus,
      count,
    }));

    return { total: jobs.length, active, offers, rejected, byStatus };
  },

  async createApplication(userId: string, data: CreateJobInput): Promise<JobApplication> {
    const job = await prisma.jobApplication.create({
      data: {
        userId,
        company: data.company,
        role: data.role,
        status: data.status,
        salaryRange: data.salaryRange || null,
        jobUrl: data.jobUrl || null,
        notes: data.notes ?? null,
        appliedAt: new Date(data.appliedAt),
        followUpAt: data.followUpAt ? new Date(data.followUpAt) : null,
      },
      include: { interviewRounds: true },
    });
    return serializeJob(job);
  },

  async updateApplication(
    userId: string,
    id: string,
    data: UpdateJobInput
  ): Promise<JobApplication> {
    const existing = await prisma.jobApplication.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Application");
    if (existing.userId !== userId) throw new ForbiddenError();

    const job = await prisma.jobApplication.update({
      where: { id },
      data: {
        ...(data.company !== undefined && { company: data.company }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.salaryRange !== undefined && { salaryRange: data.salaryRange || null }),
        ...(data.jobUrl !== undefined && { jobUrl: data.jobUrl || null }),
        ...(data.notes !== undefined && { notes: data.notes ?? null }),
        ...(data.appliedAt !== undefined && { appliedAt: new Date(data.appliedAt) }),
        ...(data.followUpAt !== undefined && {
          followUpAt: data.followUpAt ? new Date(data.followUpAt) : null,
        }),
      },
      include: { interviewRounds: { orderBy: { createdAt: "asc" } } },
    });
    return serializeJob(job);
  },

  async deleteApplication(userId: string, id: string): Promise<void> {
    const existing = await prisma.jobApplication.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Application");
    if (existing.userId !== userId) throw new ForbiddenError();
    await prisma.jobApplication.delete({ where: { id } });
  },

  async addInterviewRound(
    userId: string,
    applicationId: string,
    data: CreateInterviewInput
  ): Promise<InterviewRound> {
    const app = await prisma.jobApplication.findUnique({ where: { id: applicationId } });
    if (!app) throw new NotFoundError("Application");
    if (app.userId !== userId) throw new ForbiddenError();

    const round = await prisma.interviewRound.create({
      data: {
        applicationId,
        round: data.round,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        outcome: data.outcome ?? null,
        notes: data.notes ?? null,
      },
    });
    return serializeRound(round);
  },

  async deleteInterviewRound(userId: string, roundId: string): Promise<void> {
    const round = await prisma.interviewRound.findUnique({
      where: { id: roundId },
      include: { application: true },
    });
    if (!round) throw new NotFoundError("Interview round");
    if (round.application.userId !== userId) throw new ForbiddenError();
    await prisma.interviewRound.delete({ where: { id: roundId } });
  },
};
