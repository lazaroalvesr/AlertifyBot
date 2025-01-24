-- CreateTable
CREATE TABLE "userName" (
    "id" TEXT NOT NULL,
    "TwitchChannelName" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "DiscordChannelId" TEXT NOT NULL,
    "liveNotified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "userName_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userName_guildId_key" ON "userName"("guildId");
