import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding default terms and subfolders...');

  // Create default terms
  const term1 = await prisma.term.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Term 1',
      description: 'First term evidence',
      order: 0,
    },
  });

  const term2 = await prisma.term.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Term 2',
      description: 'Second term evidence',
      order: 1,
    },
  });

  const term3 = await prisma.term.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Term 3',
      description: 'Third term evidence',
      order: 2,
    },
  });

  console.log('✅ Created terms:', term1.name, term2.name, term3.name);

  // Create default "General" subfolder in each term
  const subfolder1 = await prisma.subfolder.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'General',
      description: 'General evidence for Term 1',
      order: 0,
      termId: term1.id,
    },
  });

  const subfolder2 = await prisma.subfolder.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'General',
      description: 'General evidence for Term 2',
      order: 0,
      termId: term2.id,
    },
  });

  const subfolder3 = await prisma.subfolder.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'General',
      description: 'General evidence for Term 3',
      order: 0,
      termId: term3.id,
    },
  });

  console.log('✅ Created default subfolders in each term');

  // Move existing evidence items to Term 1 > General subfolder
  const existingEvidence = await prisma.evidence.findMany();
  console.log(`📦 Found ${existingEvidence.length} existing evidence items to migrate`);

  for (const evidence of existingEvidence) {
    await prisma.evidence.update({
      where: { id: evidence.id },
      data: {
        subfolderId: subfolder1.id,
      },
    });
  }

  console.log(`✅ Migrated ${existingEvidence.length} evidence items to Term 1 > General`);

  // Add foreign key constraint after data migration
  await prisma.$executeRaw`
    ALTER TABLE "Evidence" 
    ADD CONSTRAINT "Evidence_subfolderId_fkey" 
    FOREIGN KEY ("subfolderId") REFERENCES "Subfolder"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE
  `;
  console.log('✅ Added foreign key constraint for subfolderId');

  // Drop old columns (outcomeId, indicatorId) - they're no longer needed
  await prisma.$executeRaw`ALTER TABLE "Evidence" DROP COLUMN IF EXISTS "outcomeId"`;
  await prisma.$executeRaw`ALTER TABLE "Evidence" DROP COLUMN IF EXISTS "indicatorId"`;
  console.log('✅ Dropped old outcomeId and indicatorId columns');

  console.log('\n🎉 Migration completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });