import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({});
// export type definition of API
export type AppRouter = typeof appRouter;
