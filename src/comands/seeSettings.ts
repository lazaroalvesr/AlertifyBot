import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

export async function HandleSeeSettings(message: Message, userConfigs: Map<string, any>) {
    const userConfig = userConfigs.get(message.guild.id);

    const prisma = new PrismaClient()

    const getNameChannel = await prisma.userName.findFirst({
        where: { guildId: message.guildId },
        select:{
            name: true
        }
    })

    if (userConfig) {
        const configMessage = [
            '**🔧 Configurações de notificações Twitch:**',
            `**Nome do Canal:** ${getNameChannel ? `${getNameChannel.name} ✅` : '❌ Não configurado'}`,
        ].join('\n');

        await message.reply(configMessage)
    } else {
        await message.reply('❌ Nenhuma configuração encontrada. Use `!configurar` para configurar as notificações.');
    }
}