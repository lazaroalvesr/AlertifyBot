import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

export async function HandleSeeSettings(message: Message, userConfigs: Map<string, any>) {
    const userConfig = userConfigs.get(message.guild.id);

    const prisma = new PrismaClient()

    const getNameChannel = await prisma.userName.findFirst({
        where: { guildId: message.guildId }
    })

    if (userConfig) {
        const configMessage = [
            '**🔧 Configurações de notificações Twitch:**',
            `**Nome do Canal:** ${getNameChannel ? ' ✅ Configurado' : '❌ Não configurado'}`,
        ].join('\n');

        await message.reply(configMessage)
    } else {
        await message.reply('❌ Nenhuma configuração encontrada. Use `!configurar` para configurar as notificações.');
    }
}