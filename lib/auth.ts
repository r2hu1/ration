import { db } from "@/db/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sendEmail } from "./email";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { organization } from "better-auth/plugins";
import { ac, admin, member, owner } from "@/modules/auth/views/ui/permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Ration - Reset your password",
        html: `Click the link to reset your password: ${url}`,
      });
    },
    resetPasswordTokenExpiresIn: 3600,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.BETTER_AUTH_URL}/~/`;
      await sendEmail({
        to: user.email,
        subject: "Ration - Verify your email address",
        html: `Click the link to verify your email: ${verificationUrl}`,
      });
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      afterDelete: async (u) => {
        await db.delete(user).where(eq(user.id, u.id));
      },
      sendDeleteAccountVerification: async ({ user, url, token }, request) => {
        await sendEmail({
          to: user.email,
          subject: "Ration - Delete your account",
          html: `Click the link to delete your account: ${url}`,
        });
      },
    },
  },
  plugins: [
    organization({
      cancelPendingInvitationsOnReInvite: true,
      ac,
      roles: {
        admin,
        member,
        owner,
      },
      organizationHooks: {
        afterCreateOrganization: async ({ organization, member, user }) => {
          await sendEmail({
            to: user.email,
            subject: `Team ${organization.name} created successfully`,
            html: `
            <div style="background-color: #f2f2f2; padding: 20px;text-align: center;color: #333;">
               <h1>Team ${organization.name} created successfully</h1>
               <p>Get started by adding members and setting up permissions.</p>
            </div>
               `,
          });
        },
        afterAddMember: async ({ member, user, organization }) => {
          // todo: send in-app notification
        },
        afterRemoveMember: async ({ member, user, organization }) => {
          // todo: send in-app notification
        },
        beforeCreateInvitation: async ({
          invitation,
          inviter,
          organization,
        }) => {
          const customExpiration = new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 7,
          ); // 7 days
          return {
            data: {
              ...invitation,
              expiresAt: customExpiration,
            },
          };
        },
        afterCreateInvitation: async ({
          invitation,
          inviter,
          organization,
        }) => {
          await sendEmail({
            to: invitation.email,
            subject: `You've been invited to join ${organization.name}`,
            html: `
                <div style="background-color: #f2f2f2; padding: 20px;text-align: center;color: #333;">
                   <h1>You've been invited to join ${organization.name}</h1>
                   <p>You have been invited to join ${organization.name} by ${inviter.name} on ${new Date().toLocaleDateString()}</p>
                   <p>click on this link to view the invitation</p>
                   <a href="${process.env.BETTER_AUTH_URL}~/invitation/${invitation.id}">View Invitation</a>
                </div>
                `,
          });
        },
        afterAcceptInvitation: async ({
          invitation,
          member,
          user,
          organization,
        }) => {
          // todo: send in-app notification
        },
        afterRejectInvitation: async ({ invitation, user, organization }) => {
          // todo: send in-app notification
        },
        beforeCancelInvitation: async ({
          invitation,
          cancelledBy,
          organization,
        }) => {
          // todo: send in-app notification
        },
        afterCancelInvitation: async ({
          invitation,
          cancelledBy,
          organization,
        }) => {
          // todo: send in-app notification
        },
      },
    }),
  ],
});
