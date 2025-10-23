import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/db/client";
import { eq, or } from "drizzle-orm";
import { teams } from "@/db/schema";

const createTeamSchema = z.object({
  name: z.string().min(4).max(100),
});

export const teamRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createTeamSchema)
    .mutation(async ({ input, ctx }) => {
      const random = Math.random().toString(36).slice(2, 6);
      const slug = [
        input.name.trim().toLowerCase().replace(/\s+/g, ""),
        ctx.auth.session.userId.slice(0, 5),
        random,
        new Date().toISOString().slice(0, 10).split("-").join(""),
      ].join("-");

      const team = await db
        .insert(teams)
        .values({
          name: input.name,
          owner: ctx.auth.session.userId,
          slug,
        })
        .returning();

      return team;
    }),
  get_all: protectedProcedure.query(async ({ ctx }) => {
    const allTeams = await db
      .select()
      .from(teams)
      .where(
        or(
          eq(teams.owner, ctx.auth.session.userId),
          eq(teams.admins, ctx.auth.session.userId),
          eq(teams.members, ctx.auth.session.userId),
          eq(teams.guests, ctx.auth.session.userId),
        ),
      );

    return allTeams;
  }),
});
