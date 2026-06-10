import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { unlink, stat } from "fs/promises";
import { join } from "path";

export const evidenceRouter = createTRPCRouter({
  // Get all evidence items
  getAll: publicProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.evidence.findMany({
      orderBy: { id: "asc" },
    });
    return items;
  }),

  // Get evidence by outcome
  getByOutcome: publicProcedure
    .input(z.object({ outcomeId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.evidence.findMany({
        where: { outcomeId: input.outcomeId },
        orderBy: { id: "asc" },
      });
    }),

  // Get single evidence item
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.evidence.findUnique({ where: { id: input.id } });
    }),

  // Create evidence item
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        outcomeId: z.string(),
        indicatorId: z.string(),
        type: z.string().default("document"),
        fileType: z.string().default("pdf"),
        description: z.string().default(""),
        fileUrl: z.string().default(""),
        filePath: z.string().nullable().optional(),
        date: z.string().default(""),
        highlightedSection: z.string().default(""),
        memoNote: z.string().default(""),
        thumbnail: z.string().default("/assets/parallax/hero-placeholder.svg"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.evidence.create({
        data: {
          title: input.title,
          outcomeId: input.outcomeId,
          indicatorId: input.indicatorId,
          type: input.type,
          fileType: input.fileType,
          description: input.description,
          fileUrl: input.fileUrl,
          filePath: input.filePath ?? null,
          date: input.date,
          highlightedSection: input.highlightedSection,
          memoNote: input.memoNote,
          thumbnail: input.thumbnail,
        },
      });
    }),

  // Update evidence item
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        highlightedSection: z.string().optional(),
        memoNote: z.string().optional(),
        fileUrl: z.string().optional(),
        filePath: z.string().nullable().optional(),
        thumbnail: z.string().optional(),
        outcomeId: z.string().optional(),
        indicatorId: z.string().optional(),
        type: z.string().optional(),
        fileType: z.string().optional(),
        date: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.evidence.update({
        where: { id },
        data,
      });
    }),

  // Restore evidence to default (remove uploaded file, reset URL)
  restore: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const evidence = await ctx.db.evidence.findUnique({
        where: { id: input.id },
      });

      if (!evidence) {
        throw new Error("Evidence not found");
      }

      // If there's a local file, delete it
      if (evidence.filePath) {
        try {
          const fullPath = join(process.cwd(), "public", evidence.filePath);
          await stat(fullPath);
          await unlink(fullPath);
        } catch {
          // File might not exist, ignore
        }
      }

      // Reset to default placeholder
      return ctx.db.evidence.update({
        where: { id: input.id },
        data: {
          fileUrl: "",
          filePath: null,
          thumbnail: "/assets/parallax/hero-placeholder.svg",
        },
      });
    }),

  // Delete evidence item
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const evidence = await ctx.db.evidence.findUnique({
        where: { id: input.id },
      });

      if (!evidence) {
        throw new Error("Evidence not found");
      }

      // Delete associated file if it exists
      if (evidence.filePath) {
        try {
          const fullPath = join(process.cwd(), "public", evidence.filePath);
          await stat(fullPath);
          await unlink(fullPath);
        } catch {
          // File might not exist, ignore
        }
      }

      return ctx.db.evidence.delete({
        where: { id: input.id },
      });
    }),
});
