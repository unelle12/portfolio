import { PrismaClient } from '../generated/prisma';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

const dataDir = join(import.meta.dirname, '../src/data');

function loadJSON(filename: string) {
  return JSON.parse(readFileSync(join(dataDir, filename), 'utf-8'));
}

async function main() {
  const portfolio = loadJSON('portfolio.json');
  const selfAssessment = loadJSON('selfAssessment.json');
  const reflections = loadJSON('reflections.json');
  const retrospection = loadJSON('retrospection.json');
  const contact = loadJSON('contact.json');
  const evidence = loadJSON('evidence.json');

  // Seed Hero
  await prisma.hero.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      giantText: 'PORTFOLIO',
      badge: 'Year 1 at PNU',
      headline: 'Welcome to My',
      headlineAccent: 'Growth Journey',
      description: 'Documenting my personal and professional development through evidence-based learning at Philippine Normal University.',
      ctaText: 'Explore My Work',
    },
  });

  // Seed Introduction
  await prisma.introduction.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: portfolio.personal.name,
      title: portfolio.personal.title,
      tagline: portfolio.personal.tagline,
      email: portfolio.personal.email,
      linkedin: portfolio.personal.linkedin,
      github: portfolio.personal.github,
      greeting: portfolio.introduction.greeting,
      bio: JSON.stringify(portfolio.introduction.bio),
      purpose: portfolio.introduction.purpose,
      guidingPrinciples: JSON.stringify(portfolio.introduction.guidingPrinciples),
    },
  });

  // Seed SelfAssessment
  await prisma.selfAssessment.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      outcomes: JSON.stringify(selfAssessment.outcomes),
    },
  });

  // Seed Terms
  const term1 = await prisma.term.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: 'Term 1', description: 'First term', order: 1 },
  });
  const term2 = await prisma.term.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, name: 'Term 2', description: 'Second term', order: 2 },
  });
  const term3 = await prisma.term.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, name: 'Term 3', description: 'Third term', order: 3 },
  });

  // Seed Subfolders for Term 1
  await prisma.subfolder.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: 'Evidence', description: 'Portfolio evidence', order: 1, termId: 1 },
  });

  // Seed Evidence
  for (const item of evidence.items) {
    await prisma.evidence.upsert({
      where: { id: parseInt(item.id.replace('ev-', '')) },
      update: {},
      create: {
        id: parseInt(item.id.replace('ev-', '')),
        title: item.title,
        type: item.type,
        fileType: item.fileType,
        description: item.description,
        thumbnail: item.thumbnail,
        fileUrl: item.fileUrl,
        highlightedSection: item.highlightedSection,
        memoNote: item.memoNote,
        date: item.date,
        subfolderId: 1,
      },
    });
  }

  // Seed Reflections
  for (const item of reflections.items) {
    const id = parseInt(item.evidenceId.replace('ev-', ''));
    await prisma.reflection.upsert({
      where: { id },
      update: {},
      create: {
        id,
        evidenceId: item.evidenceId,
        paragraphs: JSON.stringify(item.paragraphs),
      },
    });
  }

  // Seed Retrospection
  await prisma.retrospection.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      paragraphs: JSON.stringify(retrospection.paragraphs),
    },
  });

  // Seed Contact
  await prisma.contact.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      formspreeId: contact.formspreeId,
      socialLinks: JSON.stringify(contact.socialLinks),
      message: contact.message,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
