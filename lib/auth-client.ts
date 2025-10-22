import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({});

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
