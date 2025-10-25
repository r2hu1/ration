import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { ac, admin, member, owner } from "@/modules/auth/views/ui/permissions";

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac,
      roles: {
        admin,
        member,
        owner,
      },
    }),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  forgetPassword,
  resetPassword,
  accountInfo,
  deleteUser,
  listSessions,
  refreshToken,
} = authClient;
