import { createTRPCRouter } from "../trpc";
import { taskRouter } from "./task"; // must match the exported name

export const appRouter = createTRPCRouter({
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
