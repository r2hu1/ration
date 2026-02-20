import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
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
  resetPassword,
  accountInfo,
  deleteUser,
  listSessions,
  refreshToken,
} = authClient;
