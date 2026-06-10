import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { unlink, stat } from "fs/promises";
import { join } from "path";

type SubfolderWithChildren = {
  id: number;
  name: string;
  description: string | null;
  order: number;
  termId: number;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  evidence: {
    id: number;
    title: string;
    type: string;
    fileType: string;
    description: string;
    thumbnail: string;
    fileUrl: string;
    filePath: string | null;
    highlightedSection: string;
    memoNote: string;
    date: string;
    subfolderId: number | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  children: SubfolderWithChildren[];
};

type FlatSubfolderRow = {
  id: number;
  name: string;
  description: string | null;
  order: number;
  termId: number;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  evidence: SubfolderWithChildren["evidence"];
};

function buildSubfolderTree(flat: FlatSubfolderRow[]): SubfolderWithChildren[] {
  const map = new Map<number, SubfolderWithChildren>();
  const roots: SubfolderWithChildren[] = [];

  for (const sf of flat) {
    map.set(sf.id, { ...sf, children: [] });
  }

  for (const sf of flat) {
    const node = map.get(sf.id)!;
    if (sf.parentId && map.has(sf.parentId)) {
      map.get(sf.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export const evidenceRouter = createTRPCRouter({
  // Get all terms with nested subfolders and evidence
  getAll: publicProcedure.query(async ({ ctx }) => {
    const terms = await ctx.db.term.findMany({
      orderBy: { order: "asc" },
      include: {
        subfolders: {
          orderBy: { order: "asc" },
          include: {
            evidence: {
              orderBy: { id: "asc" },
            },
          },
        },
      },
    });

    return terms.map((term) => ({
      ...term,
      subfolders: buildSubfolderTree(term.subfolders),
    }));
  }),

  // Get single evidence item
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.evidence.findUnique({ where: { id: input.id } });
    }),

  // Term CRUD
  getTerms: publicProcedure.query(async ({ ctx }) => {
    const terms = await ctx.db.term.findMany({
      orderBy: { order: "asc" },
      include: {
        subfolders: {
          orderBy: { order: "asc" },
        },
      },
    });

    return terms.map((term) => ({
      ...term,
      subfolders: buildSubfolderTree(
        term.subfolders.map((sf) => ({ ...sf, evidence: [] as SubfolderWithChildren["evidence"] }))
      ),
    }));
  }),

  createTerm: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get max order value
      const maxOrder = await ctx.db.term.aggregate({
        _max: { order: true },
      });
      const newOrder = (maxOrder._max.order ?? -1) + 1;

      return ctx.db.term.create({
        data: {
          name: input.name,
          description: input.description,
          order: newOrder,
        },
      });
    }),

  updateTerm: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.term.update({
        where: { id },
        data,
      });
    }),

  deleteTerm: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.term.delete({ where: { id: input.id } });
    }),

  reorderTerms: publicProcedure
    .input(z.object({ termIds: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const updates = input.termIds.map((id, index) =>
        ctx.db.term.update({
          where: { id },
          data: { order: index },
        })
      );
      await ctx.db.$transaction(updates);
      return { success: true };
    }),

  // Subfolder CRUD
  createSubfolder: publicProcedure
    .input(
      z.object({
        termId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        parentId: z.number().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const parentId = input.parentId ?? null;

      // Get max order value scoped to parent
      const maxOrder = await ctx.db.subfolder.aggregate({
        where: { termId: input.termId, parentId },
        _max: { order: true },
      });
      const newOrder = (maxOrder._max.order ?? -1) + 1;

      return ctx.db.subfolder.create({
        data: {
          name: input.name,
          description: input.description,
          termId: input.termId,
          parentId,
          order: newOrder,
        },
      });
    }),

  updateSubfolder: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.subfolder.update({
        where: { id },
        data,
      });
    }),

  deleteSubfolder: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subfolder.delete({ where: { id: input.id } });
    }),

  reorderSubfolders: publicProcedure
    .input(z.object({ subfolderIds: z.array(z.number()), parentId: z.number().nullable() }))
    .mutation(async ({ ctx, input }) => {
      const updates = input.subfolderIds.map((id, index) =>
        ctx.db.subfolder.update({
          where: { id },
          data: { order: index },
        })
      );
      await ctx.db.$transaction(updates);
      return { success: true };
    }),

  moveEvidence: publicProcedure
    .input(
      z.object({
        evidenceId: z.number(),
        subfolderId: z.number().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.evidence.update({
        where: { id: input.evidenceId },
        data: { subfolderId: input.subfolderId },
      });
    }),

  // Evidence CRUD
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        subfolderId: z.number().nullable(),
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
          subfolderId: input.subfolderId,
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
        subfolderId: z.number().nullable().optional(),
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

  restore: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const evidence = await ctx.db.evidence.findUnique({
        where: { id: input.id },
      });

      if (!evidence) {
        throw new Error("Evidence not found");
      }

      if (evidence.filePath) {
        try {
          const fullPath = join(process.cwd(), "public", evidence.filePath);
          await stat(fullPath);
          await unlink(fullPath);
        } catch {
          // File might not exist, ignore
        }
      }

      return ctx.db.evidence.update({
        where: { id: input.id },
        data: {
          fileUrl: "",
          filePath: null,
          thumbnail: "/assets/parallax/hero-placeholder.svg",
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const evidence = await ctx.db.evidence.findUnique({
        where: { id: input.id },
      });

      if (!evidence) {
        throw new Error("Evidence not found");
      }

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
