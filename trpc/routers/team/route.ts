import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/db/client";
import { eq, or, sql } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

      const data = await auth.api.createOrganization({
        body: {
          name: input.name,
          slug: slug,
          logo: `https://az-avatar.vercel.app/api/avatar?text=${input.name.slice(0, 2)}&textColor=#111111&fontSize=20&bgColor=#fafafa&height=50&width=50`,
          userId: ctx.auth.session.userId,
          keepCurrentActiveOrganization: false,
        },
        headers: await headers(),
      });
      return data;
    }),

  get_all: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.session.userId;

    const data = await auth.api.listOrganizations({
      headers: await headers(),
    });

    return data;
  }),

  invite: protectedProcedure
    .input(
      z.object({
        email: z.email(),
        teamId: z.string(),
        role: z.enum(["admin", "member", "owner"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const hasPerms = await auth.api.hasPermission({
        headers: await headers(),
        body: {
          permissions: {
            organization: ["invite"],
          },
        },
      });
      if (!hasPerms)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You do not have permission to invite users to this organization.",
        });
      const data = await auth.api.createInvitation({
        body: {
          email: input.email,
          role: input.role,
          resend: true,
        },
        headers: await headers(),
      });
      console.log(data);
      return data;
    }),
  get_active_team: protectedProcedure.query(async ({ ctx }) => {
    const data = await auth.api.getFullOrganization({
      headers: await headers(),
    });

    return data;
  }),
  get_members_in_active_team: protectedProcedure.query(async ({ ctx }) => {
    const data = await auth.api.listMembers({
      query: {
        sortBy: "createdAt",
      },
      headers: await headers(),
    });
    return data;
  }),
});
