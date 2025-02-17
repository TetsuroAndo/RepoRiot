/*
  Warnings:

  - A unique constraint covering the columns `[gitlabId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "gitlabId" TEXT,
ADD COLUMN     "provider" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_gitlabId_key" ON "User"("gitlabId");
