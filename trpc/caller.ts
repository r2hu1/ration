import "server-only";
import { appRouter } from "./routers/_app";
import { createTRPCContext } from "./init";

export const caller = appRouter.createCaller(createTRPCContext());
