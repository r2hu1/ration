import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { projectRouter } from "./project/route";
import { teamRouter } from "./team/route";
export const appRouter = createTRPCRouter({
  teams: teamRouter,
  projects: projectRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
