import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/db/client";
import { eq, or, sql } from "drizzle-orm";
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
    const userId = ctx.auth.session.userId;

    const allTeams = await db
      .select()
      .from(teams)
      .where(
        or(
          eq(teams.owner, userId),
          sql`${teams.admins} @> ${JSON.stringify([userId])}`,
          sql`${teams.members} @> ${JSON.stringify([userId])}`,
          sql`${teams.guests} @> ${JSON.stringify([userId])}`,
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
      const admins = team.admins as any;
      const role = admins.includes(ctx.auth.session.userId);
      const owner = team.owner === ctx.auth.session.userId;
      if (!role && !owner)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can't invite users to this team",
        });
      const invite = await db
        .insert(teamInvites)
        .values({
          email: input.email,
          role: input.role,
          invited_by: ctx.auth.session.userId,
          team_id: team.id,
        })
        .returning();

      await sendEmail({
        type: "invite",
        to: input.email,
        subject: `You've been invited to join ${team.name}`,
        text: `You've been invited to join ${team.name} as a ${input.role}. click on this link to accept the invitation ${process.env.BETTER_AUTH_URL}~/invite/${invite[0].id}`,
      });

      return invite;
    }),
  get_by_slug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const [team] = await db
        .select()
        .from(teams)
        .where(eq(teams.slug, input.slug));
      if (
        !team &&
        input.slug != ctx.auth.user.name.split(" ").join("-").toLowerCase()
      )
        throw new TRPCError({ code: "NOT_FOUND" });

      return team || true;
    }),
  get_invite_details: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [invite] = await db
        .select()
        .from(teamInvites)
        .where(eq(teamInvites.id, input.id));

      if (!invite) throw new TRPCError({ code: "NOT_FOUND" });
      if (invite.email != ctx.auth.user.email) {
        console.log(invite.email, ctx.auth.user.email);
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
  accept_invite: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [invite] = await db
        .select()
        .from(teamInvites)
        .where(eq(teamInvites.id, input.id));

      if (!invite) throw new TRPCError({ code: "NOT_FOUND" });
      if (invite.email !== ctx.auth.user.email) {
        console.log(invite.email, ctx.auth.user.email);
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const [team] = await db
        .select()
        .from(teams)
        .where(eq(teams.id, invite.team_id));

      if (!team) throw new TRPCError({ code: "NOT_FOUND" });

      const role = invite.role;

      await db
        .update(teams)
        .set({
          admins:
            role === "admin"
              ? [...((team.admins as any) || []), ctx.auth.user.id]
              : team.admins,
          members:
            role === "member"
              ? [...((team.members as any) || []), ctx.auth.user.id]
              : team.members,
          guests:
            role === "guest"
              ? [...((team.guests as any) || []), ctx.auth.user.id]
              : team.guests,
        })
        .where(eq(teams.id, invite.team_id));

      await db.delete(teamInvites).where(eq(teamInvites.id, input.id));
      const invitedByEmail = await db
        .select()
        .from(user)
        .where(eq(user.id, invite.invited_by))
        .then((res) => res[0].email);
      await sendEmail({
        type: "accept-invite",
        to: invitedByEmail,
        subject: "Team Invitation Accepted",
        text: `${ctx.auth.user.email} has joined the ${team.name}.`,
      });

      return true;
    }),
});
