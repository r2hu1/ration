import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [organizationClient()],
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
