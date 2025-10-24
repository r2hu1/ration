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
          sql`${teams.admins} @> to_jsonb(array[${userId}]::text[])`,
          sql`${teams.members} @> to_jsonb(array[${userId}]::text[])`,
          sql`${teams.guests} @> to_jsonb(array[${userId}]::text[])`,
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

      const admins = (team.admins as any) ?? [];
      const isAdmin = admins.includes(ctx.auth.session.userId);
      const isOwner = team.owner === ctx.auth.session.userId;

      if (!isAdmin && !isOwner) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can't invite users to this team",
        });
      }

      const invite = await db
        .insert(teamInvites)
        .values({
          email: input.email.trim().toLowerCase(),
          role: input.role,
          invited_by: ctx.auth.session.userId,
          team_id: team.id,
        })
        .returning();

      await sendEmail({
        type: "invite",
        to: input.email,
        subject: `You've been invited to join ${team.name}`,
        text: `You've been invited to join ${team.name} as a ${input.role}. Click this link to accept: ${process.env.NEXT_PUBLIC_APP_URL}/~/invite/${invite[0].id}`,
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

      if (team) return team;

      const fallbackSlug = ctx.auth.user.name
        .split(" ")
        .join("-")
        .toLowerCase();

      if (input.slug === fallbackSlug) {
        return {
          id: null,
          name: ctx.auth.user.name,
          slug: fallbackSlug,
          owner: ctx.auth.user.id,
        };
      }

      throw new TRPCError({ code: "NOT_FOUND" });
    }),

  get_invite_details: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const userEmail = ctx.auth.user.email.trim().toLowerCase();

      const [invite] = await db
        .select()
        .from(teamInvites)
        .where(eq(teamInvites.id, input.id));

      if (!invite)
        throw new TRPCError({ code: "NOT_FOUND", message: "Invite not found" });

      if (invite.email.trim().toLowerCase() !== userEmail) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invite not for this user",
        });
      }

      const inviter = await db
        .select({ name: user.name })
        .from(user)
        .where(eq(user.id, invite.invited_by))
        .then((res) => res[0]);

      const invitedByName = inviter?.name ?? "Unknown";

      const [team] = await db
        .select({
          id: teams.id,
          name: teams.name,
          slug: teams.slug,
        })
        .from(teams)
        .where(eq(teams.id, invite.team_id));

      if (!team)
        throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" });

      return {
        email: invite.email,
        role: invite.role,
        invited_by: invitedByName,
        team,
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

      if (
        invite.email.trim().toLowerCase() !==
        ctx.auth.user.email.trim().toLowerCase()
      ) {
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
              ? Array.from(
                  new Set([...((team.admins as any) || []), ctx.auth.user.id]),
                )
              : team.admins,
          members:
            role === "member"
              ? Array.from(
                  new Set([...((team.members as any) || []), ctx.auth.user.id]),
                )
              : team.members,
          guests:
            role === "guest"
              ? Array.from(
                  new Set([...((team.guests as any) || []), ctx.auth.user.id]),
                )
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
        text: `${ctx.auth.user.email} has joined ${team.name}.`,
      });

      return true;
    }),

  leave_team: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [team] = await db
        .select()
        .from(teams)
        .where(eq(teams.slug, input.slug));

      if (!team) throw new TRPCError({ code: "NOT_FOUND" });

      const admins = (team.admins as any) ?? [];
      const members = (team.members as any) ?? [];
      const guests = (team.guests as any) ?? [];

      const role = admins.includes(ctx.auth.user.id)
        ? "admin"
        : members.includes(ctx.auth.user.id)
          ? "member"
          : guests.includes(ctx.auth.user.id)
            ? "guest"
            : null;

      await db
        .update(teams)
        .set({
          admins:
            role === "admin"
              ? admins.filter((id: any) => id !== ctx.auth.user.id)
              : team.admins,
          members:
            role === "member"
              ? members.filter((id: any) => id !== ctx.auth.user.id)
              : team.members,
          guests:
            role === "guest"
              ? guests.filter((id: any) => id !== ctx.auth.user.id)
              : team.guests,
        })
        .where(eq(teams.slug, input.slug));

      return true;
    }),
});
