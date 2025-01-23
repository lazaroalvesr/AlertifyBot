/*
  Warnings:

  - You are about to drop the column `channelId` on the `userName` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `userName` table. All the data in the column will be lost.
  - Added the required column `DiscordChannelId` to the `userName` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TwitchChannelName` to the `userName` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userName" DROP COLUMN "channelId",
DROP COLUMN "name",
ADD COLUMN     "DiscordChannelId" TEXT NOT NULL,
ADD COLUMN     "TwitchChannelName" TEXT NOT NULL;
