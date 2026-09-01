-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('AWAITING_COLLECTION', 'COLLECTED');

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "foundLocation" TEXT NOT NULL,
    "retrievalLocation" TEXT NOT NULL,
    "imageUrl" TEXT,
    "finderContact" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'AWAITING_COLLECTION',
    "collectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reportedById" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_studentId_status_idx" ON "Report"("studentId", "status");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
