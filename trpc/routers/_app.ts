import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { teamRouter } from "./team/route";
export const appRouter = createTRPCRouter({
  teams: teamRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
