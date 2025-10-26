import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { teamRouter } from "./team/route";
import { projectRouter } from "./project/route";
export const appRouter = createTRPCRouter({
  teams: teamRouter,
  projects: projectRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
