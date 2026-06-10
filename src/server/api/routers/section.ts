import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const sectionRouter = createTRPCRouter({
  // Get all sections
  getAll: publicProcedure.query(async ({ ctx }) => {
    const [hero, introduction, selfAssessment, retrospection, contact, reflections] =
      await Promise.all([
        ctx.db.hero.findUnique({ where: { id: 1 } }),
        ctx.db.introduction.findUnique({ where: { id: 1 } }),
        ctx.db.selfAssessment.findUnique({ where: { id: 1 } }),
        ctx.db.retrospection.findUnique({ where: { id: 1 } }),
        ctx.db.contact.findUnique({ where: { id: 1 } }),
        ctx.db.reflection.findMany({ orderBy: { id: "asc" } }),
      ]);

    return {
      hero: hero ?? null,
      introduction: introduction
        ? {
            personal: {
              name: introduction.name,
              title: introduction.title,
              tagline: introduction.tagline,
              email: introduction.email,
              linkedin: introduction.linkedin,
              github: introduction.github,
            },
            greeting: introduction.greeting,
            bio: JSON.parse(introduction.bio),
            purpose: introduction.purpose,
            guidingPrinciples: JSON.parse(introduction.guidingPrinciples),
          }
        : null,
      selfAssessment: selfAssessment
        ? { ...selfAssessment, outcomes: JSON.parse(selfAssessment.outcomes) }
        : null,
      retrospection: retrospection
        ? { ...retrospection, paragraphs: JSON.parse(retrospection.paragraphs) }
        : null,
      contact: contact
        ? {
            ...contact,
            socialLinks: JSON.parse(contact.socialLinks),
          }
        : null,
      reflections: reflections.map((r) => ({
        ...r,
        paragraphs: JSON.parse(r.paragraphs),
      })),
    };
  }),

  // Get hero
  getHero: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.hero.findUnique({ where: { id: 1 } });
  }),

  // Update hero
  updateHero: publicProcedure
    .input(
      z.object({
        giantText: z.string().optional(),
        badge: z.string().optional(),
        headline: z.string().optional(),
        headlineAccent: z.string().optional(),
        description: z.string().optional(),
        ctaText: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.hero.upsert({
        where: { id: 1 },
        update: input,
        create: { id: 1, ...input },
      });
    }),

  // Get introduction
  getIntroduction: publicProcedure.query(async ({ ctx }) => {
    const intro = await ctx.db.introduction.findUnique({ where: { id: 1 } });
    if (!intro) return null;
    return {
      personal: {
        name: intro.name,
        title: intro.title,
        tagline: intro.tagline,
        email: intro.email,
        linkedin: intro.linkedin,
        github: intro.github,
      },
      greeting: intro.greeting,
      bio: JSON.parse(intro.bio),
      purpose: intro.purpose,
      guidingPrinciples: JSON.parse(intro.guidingPrinciples),
    };
  }),

  // Update introduction (accepts nested personal object)
  updateIntroduction: publicProcedure
    .input(
      z.object({
        personal: z
          .object({
            name: z.string().optional(),
            title: z.string().optional(),
            tagline: z.string().optional(),
            email: z.string().optional(),
            linkedin: z.string().optional(),
            github: z.string().optional(),
          })
          .optional(),
        greeting: z.string().optional(),
        bio: z.array(z.string()).optional(),
        purpose: z.string().optional(),
        guidingPrinciples: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data: Record<string, unknown> = {};
      if (input.personal) {
        if (input.personal.name !== undefined) data.name = input.personal.name;
        if (input.personal.title !== undefined) data.title = input.personal.title;
        if (input.personal.tagline !== undefined) data.tagline = input.personal.tagline;
        if (input.personal.email !== undefined) data.email = input.personal.email;
        if (input.personal.linkedin !== undefined) data.linkedin = input.personal.linkedin;
        if (input.personal.github !== undefined) data.github = input.personal.github;
      }
      if (input.greeting !== undefined) data.greeting = input.greeting;
      if (input.bio !== undefined) data.bio = JSON.stringify(input.bio);
      if (input.purpose !== undefined) data.purpose = input.purpose;
      if (input.guidingPrinciples !== undefined)
        data.guidingPrinciples = JSON.stringify(input.guidingPrinciples);

      const existing = await ctx.db.introduction.findUnique({ where: { id: 1 } });

      return ctx.db.introduction.upsert({
        where: { id: 1 },
        update: data,
        create: {
          id: 1,
          name: input.personal?.name ?? existing?.name ?? "",
          title: input.personal?.title ?? existing?.title ?? "",
          tagline: input.personal?.tagline ?? existing?.tagline ?? "",
          email: input.personal?.email ?? existing?.email ?? "",
          linkedin: input.personal?.linkedin ?? existing?.linkedin ?? "",
          github: input.personal?.github ?? existing?.github ?? "",
          greeting: input.greeting ?? existing?.greeting ?? "Hello, I'm",
          bio: input.bio ? JSON.stringify(input.bio) : existing?.bio ?? "[]",
          purpose: input.purpose ?? existing?.purpose ?? "",
          guidingPrinciples: input.guidingPrinciples
            ? JSON.stringify(input.guidingPrinciples)
            : existing?.guidingPrinciples ?? "[]",
        },
      });
    }),

  // Get self assessment
  getSelfAssessment: publicProcedure.query(async ({ ctx }) => {
    const sa = await ctx.db.selfAssessment.findUnique({ where: { id: 1 } });
    if (!sa) return null;
    return { ...sa, outcomes: JSON.parse(sa.outcomes) };
  }),

  // Update self assessment (accepts full outcomes object)
  updateSelfAssessment: publicProcedure
    .input(z.object({ outcomes: z.unknown() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.selfAssessment.upsert({
        where: { id: 1 },
        update: { outcomes: JSON.stringify(input.outcomes) },
        create: { id: 1, outcomes: JSON.stringify(input.outcomes) },
      });
    }),

  // Get retrospection
  getRetrospection: publicProcedure.query(async ({ ctx }) => {
    const r = await ctx.db.retrospection.findUnique({ where: { id: 1 } });
    if (!r) return null;
    return { ...r, paragraphs: JSON.parse(r.paragraphs) };
  }),

  // Update retrospection
  updateRetrospection: publicProcedure
    .input(z.object({ paragraphs: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.retrospection.upsert({
        where: { id: 1 },
        update: { paragraphs: JSON.stringify(input.paragraphs) },
        create: { id: 1, paragraphs: JSON.stringify(input.paragraphs) },
      });
    }),

  // Get contact
  getContact: publicProcedure.query(async ({ ctx }) => {
    const c = await ctx.db.contact.findUnique({ where: { id: 1 } });
    if (!c) return null;
    return { ...c, socialLinks: JSON.parse(c.socialLinks) };
  }),

  // Update contact (accepts socialLinks as array)
  updateContact: publicProcedure
    .input(
      z.object({
        formspreeId: z.string().optional(),
        socialLinks: z.array(z.object({
          platform: z.string(),
          url: z.string(),
          icon: z.string(),
        })).optional(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data: Record<string, unknown> = {};
      if (input.formspreeId !== undefined) data.formspreeId = input.formspreeId;
      if (input.socialLinks !== undefined) data.socialLinks = JSON.stringify(input.socialLinks);
      if (input.message !== undefined) data.message = input.message;

      return ctx.db.contact.upsert({
        where: { id: 1 },
        update: data,
        create: {
          id: 1,
          formspreeId: input.formspreeId ?? "",
          socialLinks: input.socialLinks
            ? JSON.stringify(input.socialLinks)
            : "[]",
          message: input.message ?? "",
        },
      });
    }),

  // Update a reflection
  updateReflection: publicProcedure
    .input(
      z.object({
        evidenceId: z.string(),
        paragraphs: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.reflection.findFirst({
        where: { evidenceId: input.evidenceId },
      });

      if (existing) {
        return ctx.db.reflection.update({
          where: { id: existing.id },
          data: { paragraphs: JSON.stringify(input.paragraphs) },
        });
      }

      return ctx.db.reflection.create({
        data: {
          evidenceId: input.evidenceId,
          paragraphs: JSON.stringify(input.paragraphs),
        },
      });
    }),

  // Reset a section to defaults
  resetSection: publicProcedure
    .input(z.object({ section: z.string() }))
    .mutation(async ({ ctx, input }) => {
      switch (input.section) {
        case "hero":
          return ctx.db.hero.upsert({
            where: { id: 1 },
            update: {
              giantText: "PORTFOLIO",
              badge: "Year 1 at PNU",
              headline: "Welcome to My",
              headlineAccent: "Growth Journey",
              description:
                "Documenting my personal and professional development through evidence-based learning at Philippine Normal University.",
              ctaText: "Explore My Work",
            },
            create: {
              id: 1,
              giantText: "PORTFOLIO",
              badge: "Year 1 at PNU",
              headline: "Welcome to My",
              headlineAccent: "Growth Journey",
              description:
                "Documenting my personal and professional development through evidence-based learning at Philippine Normal University.",
              ctaText: "Explore My Work",
            },
          });
        default:
          return { success: true };
      }
    }),
});
