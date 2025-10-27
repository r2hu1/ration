import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/db/client";
import { and, eq, or, sql } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { personalProject } from "@/db/schema";

const createProjectSchema = z.object({
  name: z.string().min(4).max(100),
  description: z.string().optional(),
});

export const projectRouter = createTRPCRouter({
  get_all: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.session.userId;
    const projects = await db
      .select()
      .from(personalProject)
      .where(eq(personalProject.userId, userId));
    return projects;
  }),
  create_personal_project: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.session.userId;
      const random = Math.random().toString(36).slice(2, 6);
      const slug = [
        input.name.trim().toLowerCase().replace(/\s+/g, "-"),
        random,
      ].join("-");

      const [createdProject] = await db
        .insert(personalProject)
        .values({
          name: input.name,
          userId: userId,
          slug: slug,
          description: input.description,
        })
        .returning();

      return createdProject;
    }),
  get_by_slug: protectedProcedure
    .input(z.object({ slug: z.string().min(4).max(100) }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.session.userId;

      const [project] = await db
        .select()
        .from(personalProject)
        .where(
          and(
            eq(personalProject.userId, userId),
            eq(personalProject.slug, input.slug),
          ),
        );

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return project;
    }),
  update_by_slug: protectedProcedure
    .input(
      z.object({
        slug: z.string().max(100),
        name: z.string().max(100).optional(),
        description: z.string().max(200).optional(),
        type: z.enum(["production", "development", "test"]).optional(),
        envs: z.record(z.string(), z.any()).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.session.userId;

      const [getProject] = await db
        .select()
        .from(personalProject)
        .where(
          and(
            eq(personalProject.userId, userId),
            eq(personalProject.slug, input.slug),
          ),
        );

      if (!getProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const mergedEnvs =
        input.envs !== undefined
          ? { ...(getProject.envs ?? {}), ...input.envs }
          : (getProject.envs ?? {});

      const [updatedProject] = await db
        .update(personalProject)
        .set({
          name: input.name ?? getProject.name,
          description: input.description ?? getProject.description,
          type: input.type ?? getProject.type,
          envs: mergedEnvs,
        })
        .where(
          and(
            eq(personalProject.userId, userId),
            eq(personalProject.slug, input.slug),
          ),
        )
        .returning();

      return updatedProject;
    }),
});
