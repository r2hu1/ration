import { db } from "@/db/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sendEmail } from "./email";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

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
        type: "reset-password",
        to: user.email,
        subject: "Ration - Reset your password",
        text: `Click the link to reset your password: ${url}`,
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
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.BETTER_AUTH_URL}/app/`;
      await sendEmail({
        type: "verify-email",
        to: user.email,
        subject: "Ration - Verify your email address",
        text: `Click the link to verify your email: ${verificationUrl}`,
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
          type: "delete-account",
          to: user.email,
          subject: "Ration - Delete your account",
          text: `Click the link to delete your account: ${url}`,
        });
      },
    },
  },
});
