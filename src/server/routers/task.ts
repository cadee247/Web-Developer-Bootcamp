import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "../db/client";

export const taskRouter = createTRPCRouter({
  getMyTasks: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.task.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  createTask: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.task.create({
        data: { title: input.title, userId: ctx.session.user.id },
      });
    }),

  toggleTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await prisma.task.findUnique({ where: { id: input.id } });
      if (!task || task.userId !== ctx.session.user.id) throw new Error("Not allowed");
      return await prisma.task.update({
        where: { id: input.id },
        data: { completed: !task.completed },
      });
    }),

  deleteTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await prisma.task.findUnique({ where: { id: input.id } });
      if (!task || task.userId !== ctx.session.user.id) throw new Error("Not allowed");
      return await prisma.task.delete({ where: { id: input.id } });
    }),
});
