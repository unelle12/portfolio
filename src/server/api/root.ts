import { sectionRouter } from "~/server/api/routers/section";
import { evidenceRouter } from "~/server/api/routers/evidence";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  section: sectionRouter,
  evidence: evidenceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.section.getAll();
 *       ^? SectionData
 */
export const createCaller = createCallerFactory(appRouter);
