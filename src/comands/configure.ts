import { PrismaClient } from "@prisma/client";
import { Message, TextChannel } from "discord.js";
import { validateUserConfig } from "../utils/validateUser";

export async function HandleConfigue(message: Message, userConfigs: Map<string, any>) {
    const prisma = new PrismaClient();

    const filter = (response: Message): boolean => response.author.id === message.author.id;

    if (message.channel instanceof TextChannel) {
        await message.reply("Por favor, digite o **nome do seu canal da Twitch**:");

        try {
            const channelResponse = await message.channel.awaitMessages({ filter, max: 1, time: 60000 });
            const twitchChannelName = channelResponse.first()?.content;

            if (!twitchChannelName) {
                return await message.reply("❌ Você não forneceu um nome de canal válido.");
            }
            const existingChannel = await prisma.userName.findFirst({
                where: { guildId: message.guildId }
            })

            if (existingChannel) {
                await message.reply("❌ Nome do canal já preenchido.");
                return;
            }

            const input = await prisma.userName.create({
                data: { name: twitchChannelName, guildId: message.guildId, channelId: message.channelId }
            })


            const validConfig = await validateUserConfig(input);
            userConfigs.set(message.guild.id, validConfig);

            await message.reply(`✅ Canal **${twitchChannelName}** registrado com sucesso!`);
        } catch (error) {
            await message.reply("❌ Configuração inválida ou tempo expirado. Por favor, tente novamente.");
        } finally {
            await prisma.$disconnect();
        }
    } else {
        await message.reply("❌ Este comando só pode ser usado em um canal de texto.");
    }
}
