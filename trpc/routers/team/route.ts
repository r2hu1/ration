import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/db/client";
import { eq, or } from "drizzle-orm";
import { teamInvites, teams, user } from "@/db/schema";
import { sendEmail } from "@/lib/email";

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
  invite: protectedProcedure
    .input(
      z.object({
        email: z.email(),
        teamId: z.string(),
        role: z.enum(["admin", "member", "guest"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [team] = await db
        .select()
        .from(teams)
        .where(eq(teams.slug, input.teamId));

      console.log(team);

      const invite = await db
        .insert(teamInvites)
        .values({
          email: input.email,
          role: input.role,
          invited_by: ctx.auth.session.userId,
          team_id: team.id,
        })
        .returning();
      console.log(invite);

      await sendEmail({
        type: "invite",
        to: input.email,
        subject: `You've been invited to join ${team.name}`,
        text: `You've been invited to join ${team.name} as a ${input.role}. click on this link to accept the invitation ${process.env.BETTER_AUTH_URL}~/invite/${invite[0].id}`,
      });

      return invite;
    }),

  get_invite_details: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [invite] = await db
        .select()
        .from(teamInvites)
        .where(eq(teamInvites.id, input.id));

      if (!invite) throw new TRPCError({ code: "NOT_FOUND" });
      if (invite.email !== ctx.auth.user.email) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const invitedByName = await db
        .select()
        .from(user)
        .where(eq(user.id, invite.invited_by))
        .then((res) => res[0].name);

      const [team] = await db
        .select()
        .from(teams)
        .where(eq(teams.id, invite.team_id));

      if (!team) throw new TRPCError({ code: "NOT_FOUND" });
      return {
        email: invite.email,
        role: invite.role,
        invited_by: invitedByName,
        team: {
          id: team.id,
          name: team.name,
          slug: team.slug,
        },
        invited_on: invite.createdAt,
      };
    }),
});
