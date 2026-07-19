-- AlterTable
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;

-- CreateEnum
CREATE TYPE "CompletionKind" AS ENUM ('LESSON_STEP', 'PRACTICE');

-- CreateTable
CREATE TABLE "BattleRoom" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "challengeId" TEXT NOT NULL,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT,
    "player1Code" TEXT NOT NULL DEFAULT '',
    "player2Code" TEXT NOT NULL DEFAULT '',
    "player1Done" BOOLEAN NOT NULL DEFAULT false,
    "player2Done" BOOLEAN NOT NULL DEFAULT false,
    "player1Result" TEXT NOT NULL DEFAULT '',
    "player2Result" TEXT NOT NULL DEFAULT '',
    "winnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BattleRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Completion" (
    "userId" TEXT NOT NULL,
    "kind" "CompletionKind" NOT NULL,
    "activityId" TEXT NOT NULL,
    "xpAwarded" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Completion_pkey" PRIMARY KEY ("userId","kind","activityId")
);

-- CreateTable
CREATE TABLE "ExecutionQuota" (
    "userId" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ExecutionQuota_pkey" PRIMARY KEY ("userId","windowStart")
);

-- CreateIndex
CREATE INDEX "Completion_userId_completedAt_idx" ON "Completion"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "ExecutionQuota_windowStart_idx" ON "ExecutionQuota"("windowStart");

-- AddForeignKey
ALTER TABLE "Completion" ADD CONSTRAINT "Completion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutionQuota" ADD CONSTRAINT "ExecutionQuota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
