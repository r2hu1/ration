import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/db/client";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { personalProject, teamProject } from "@/db/schema";
import { decrypt, encrypt } from "@/lib/crypto";

const createProjectSchema = z.object({
  name: z.string().min(4).max(100),
  description: z.string().optional(),
  type: z.enum(["PERSONAL", "TEAM"]).default("PERSONAL"),
});

export const projectRouter = createTRPCRouter({
  get_all: protectedProcedure
    .input(
      z.object({
        type: z.enum(["PERSONAL", "TEAM"]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.session.userId;

      if (input.type === "PERSONAL") {
        const projects = await db
          .select()
          .from(personalProject)
          .where(eq(personalProject.userId, userId));

        if (!projects) throw new TRPCError({ code: "NOT_FOUND" });
        return projects;
      }

      if (input.type === "TEAM") {
        const activeOrg = await auth.api.getFullOrganization({
          headers: await headers(),
        });
        const projects = await db
          .select()
          .from(teamProject)
          .where(eq(teamProject.teamId, activeOrg?.id as string));

        if (!projects)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        return projects;
      }
    }),

  create_project: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.session.userId;
      const random = Math.random().toString(36).slice(2, 6);
      const slug = `${input.name.trim().toLowerCase().replace(/\s+/g, "-")}-${random}`;
      const createFor =
        input.type === "PERSONAL" ? personalProject : teamProject;
      const linkTo =
        input.type === "PERSONAL"
          ? { userId }
          : {
              teamId: (
                await auth.api.getFullOrganization({ headers: await headers() })
              )?.id,
            };

      const [createdProject] = await db
        .insert(createFor)
        .values({
          name: input.name,
          slug,
          description: input.description,
          ...linkTo,
        })
        .returning();

      return createdProject;
    }),

  get_by_slug: protectedProcedure
    .input(
      z.object({
        slug: z.string().min(4).max(100),
        type: z.enum(["PERSONAL", "TEAM"]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.session.userId;

      if (input.type === "PERSONAL") {
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

        const decryptedEnvs: Record<string, string> = {};
        for (const [key, value] of Object.entries(project.envs ?? {})) {
          try {
            decryptedEnvs[key] = await decrypt(String(value));
          } catch {
            decryptedEnvs[key] = String(value);
          }
        }

        return { ...project, envs: decryptedEnvs };
      }

      if (input.type === "TEAM") {
        const data = await auth.api.getFullOrganization({
          headers: await headers(),
        });

        const [project] = await db
          .select()
          .from(teamProject)
          .where(
            and(
              eq(teamProject.teamId, data?.id as string),
              eq(teamProject.slug, input.slug),
            ),
          );

        if (!project) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        const decryptedEnvs: Record<string, string> = {};
        for (const [key, value] of Object.entries(project.envs ?? {})) {
          try {
            decryptedEnvs[key] = await decrypt(String(value));
          } catch {
            decryptedEnvs[key] = String(value);
          }
        }

        return { ...project, envs: decryptedEnvs };
      }
    }),

  update_by_slug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        name: z.string().optional(),
        description: z.string().max(200).optional(),
        projectType: z.enum(["PERSONAL", "TEAM"]).default("PERSONAL"),
        envs: z.record(z.string(), z.any()).optional(),
        deleteEnvKeys: z.array(z.string()).optional(),
        type: z.enum(["production", "development", "test"]).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.session.userId;

      if (input.projectType === "PERSONAL") {
        const [existingProject] = await db
          .select()
          .from(personalProject)
          .where(
            and(
              eq(personalProject.userId, userId),
              eq(personalProject.slug, input.slug),
            ),
          );

        if (!existingProject)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });

        let mergedEnvs: Record<string, any> = existingProject.envs ?? {};

        // Handle environment variable deletions
        if (input.deleteEnvKeys && input.deleteEnvKeys.length > 0) {
          for (const keyToDelete of input.deleteEnvKeys) {
            delete mergedEnvs[keyToDelete];
          }
        }

        // Handle environment variable additions/updates
        if (input.envs) {
          const encryptedEnvs: Record<string, string> = {};
          for (const [key, value] of Object.entries(input.envs)) {
            if (typeof value === "string" && value.trim() !== "") {
              encryptedEnvs[key] = await encrypt(value);
            }
          }
          mergedEnvs = { ...mergedEnvs, ...encryptedEnvs };
        }

        const [updatedProject] = await db
          .update(personalProject)
          .set({
            name: input.name ?? existingProject.name,
            description: input.description ?? existingProject.description,
            type: input.type ?? existingProject.type,
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
      }

      if (input.projectType === "TEAM") {
        const team = await auth.api.getFullOrganization({
          headers: await headers(),
        });

        const isMember = team?.members.some(
          (member) => member.userId === ctx.auth.session.userId,
        );

        if (!isMember) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not a member of this team",
          });
        }

        const [existingProject] = await db
          .select()
          .from(teamProject)
          .where(eq(teamProject.slug, input.slug));

        if (!existingProject)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });

        let mergedEnvs: Record<string, any> = existingProject.envs ?? {};

        // Handle environment variable deletions
        if (input.deleteEnvKeys && input.deleteEnvKeys.length > 0) {
          for (const keyToDelete of input.deleteEnvKeys) {
            delete mergedEnvs[keyToDelete];
          }
        }

        // Handle environment variable additions/updates
        if (input.envs) {
          const encryptedEnvs: Record<string, string> = {};
          for (const [key, value] of Object.entries(input.envs)) {
            if (typeof value === "string" && value.trim() !== "") {
              encryptedEnvs[key] = await encrypt(value);
            }
          }
          mergedEnvs = { ...mergedEnvs, ...encryptedEnvs };
        }

        const [updatedProject] = await db
          .update(teamProject)
          .set({
            name: input.name ?? existingProject.name,
            description: input.description ?? existingProject.description,
            type: input.type ?? existingProject.type,
            envs: mergedEnvs,
          })
          .where(and(eq(teamProject.slug, input.slug)))
          .returning();

        return updatedProject;
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        type: z.enum(["PERSONAL", "TEAM"]).default("PERSONAL"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type == "TEAM") {
        const data = await auth.api.getFullOrganization({
          headers: await headers(),
        });
        const [existingProject] = await db
          .select()
          .from(teamProject)
          .where(
            and(
              eq(teamProject.teamId, data?.id as string),
              eq(teamProject.slug, input.slug),
            ),
          );

        if (!existingProject)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });

        const [deletedProject] = await db
          .delete(teamProject)
          .where(
            and(
              eq(teamProject.slug, input.slug),
              eq(teamProject.teamId, data?.id as string),
            ),
          )
          .returning();

        return deletedProject;
      }

      const [existingProject] = await db
        .select()
        .from(personalProject)
        .where(
          and(
            eq(personalProject.slug, input.slug),
            eq(personalProject.userId, ctx.auth.session.userId),
          ),
        );

      if (!existingProject)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });

      const [deletedProject] = await db
        .delete(personalProject)
        .where(
          and(
            eq(personalProject.slug, input.slug),
            eq(personalProject.userId, ctx.auth.session.userId),
          ),
        )
        .returning();

      return deletedProject;
    }),
});
