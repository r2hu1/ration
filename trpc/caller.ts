import "server-only";
import { createTRPCContext } from "./init";
import { appRouter } from "./routers/_app";

export const caller = appRouter.createCaller(createTRPCContext());
