import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/db/client";
import { eq, or, sql } from "drizzle-orm";
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
});
