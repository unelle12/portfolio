-- Create Term table
CREATE TABLE "Term" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Term_order_idx" ON "Term"("order");

-- Create Subfolder table
CREATE TABLE "Subfolder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "termId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subfolder_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Subfolder_termId_order_idx" ON "Subfolder"("termId", "order");

-- Add foreign key from Subfolder to Term
ALTER TABLE "Subfolder" ADD CONSTRAINT "Subfolder_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add new columns to Evidence table
ALTER TABLE "Evidence" ADD COLUMN "subfolderId" INTEGER;
ALTER TABLE "Evidence" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Evidence" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create index on subfolderId
CREATE INDEX "Evidence_subfolderId_idx" ON "Evidence"("subfolderId");

-- Add foreign key from Evidence to Subfolder (will be added after data migration)
-- ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_subfolderId_fkey" FOREIGN KEY ("subfolderId") REFERENCES "Subfolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Drop old columns (after data migration)
-- ALTER TABLE "Evidence" DROP COLUMN "outcomeId";
-- ALTER TABLE "Evidence" DROP COLUMN "indicatorId";