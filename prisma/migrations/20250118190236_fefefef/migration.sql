/*
  Warnings:

  - Added the required column `channelId` to the `userName` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userName" ADD COLUMN     "channelId" TEXT NOT NULL;
