-- CreateTable
CREATE TABLE "Hero" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "giantText" TEXT NOT NULL DEFAULT 'PORTFOLIO',
    "badge" TEXT NOT NULL DEFAULT 'Year 1 at PNU',
    "headline" TEXT NOT NULL DEFAULT 'Welcome to My',
    "headlineAccent" TEXT NOT NULL DEFAULT 'Growth Journey',
    "description" TEXT NOT NULL DEFAULT 'Documenting my personal and professional development through evidence-based learning at Philippine Normal University.',
    "ctaText" TEXT NOT NULL DEFAULT 'Explore My Work',

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Introduction" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "tagline" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "linkedin" TEXT NOT NULL DEFAULT '',
    "github" TEXT NOT NULL DEFAULT '',
    "greeting" TEXT NOT NULL DEFAULT 'Hello, I''m',
    "bio" TEXT NOT NULL DEFAULT '[]',
    "purpose" TEXT NOT NULL DEFAULT '',
    "guidingPrinciples" TEXT NOT NULL DEFAULT '[]',

    CONSTRAINT "Introduction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelfAssessment" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "outcomes" TEXT NOT NULL DEFAULT '[]',

    CONSTRAINT "SelfAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" SERIAL NOT NULL,
    "outcomeId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'document',
    "fileType" TEXT NOT NULL DEFAULT 'pdf',
    "description" TEXT NOT NULL DEFAULT '',
    "thumbnail" TEXT NOT NULL DEFAULT '/assets/parallax/hero-placeholder.svg',
    "fileUrl" TEXT NOT NULL DEFAULT '',
    "highlightedSection" TEXT NOT NULL DEFAULT '',
    "memoNote" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL DEFAULT '',
    "filePath" TEXT,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reflection" (
    "id" SERIAL NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "paragraphs" TEXT NOT NULL DEFAULT '[]',

    CONSTRAINT "Reflection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Retrospection" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "paragraphs" TEXT NOT NULL DEFAULT '[]',

    CONSTRAINT "Retrospection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "formspreeId" TEXT NOT NULL DEFAULT '',
    "socialLinks" TEXT NOT NULL DEFAULT '[]',
    "message" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
