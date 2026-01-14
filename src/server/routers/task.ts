import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

// All task-related tRPC procedures
export const taskRouter = createTRPCRouter({
  getMyTasks: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.task.findMany({
      where: { userId: Number(ctx.session.user.id) }, // convert string to number
      orderBy: { createdAt: "desc" },
    });
  }),

  createTask: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.task.create({
        data: { title: input.title, userId: Number(ctx.session.user.id) },
      });
    }),

  toggleTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const taskId = Number(input.id);
      const task = await ctx.prisma.task.findUnique({ where: { id: taskId } });
      if (!task || task.userId !== Number(ctx.session.user.id)) throw new Error("Not allowed");
      return await ctx.prisma.task.update({
        where: { id: taskId },
        data: { completed: !task.completed },
      });
    }),

  deleteTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const taskId = Number(input.id);
      const task = await ctx.prisma.task.findUnique({ where: { id: taskId } });
      if (!task || task.userId !== Number(ctx.session.user.id)) throw new Error("Not allowed");
      return await ctx.prisma.task.delete({ where: { id: taskId } });
    }),
});
