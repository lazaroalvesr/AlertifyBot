/*
  Warnings:

  - A unique constraint covering the columns `[guildId]` on the table `userName` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `guildId` to the `userName` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userName" ADD COLUMN     "guildId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "userName_guildId_key" ON "userName"("guildId");
