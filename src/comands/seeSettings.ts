import { PrismaClient } from "@prisma/client";
import { EmbedBuilder, Message } from "discord.js";

export async function HandleSeeSettings(message: Message) {
    const prisma = new PrismaClient();

    const args = message.content.split(' ').slice(1);
    const subComand = args[0];
    const newChannelName = args.slice(1).join();

    if (subComand === 'editar') {
        if (!newChannelName) {
            await message.reply('❌ Você precisa informar o novo nome do canal. Exemplo: `!verConfigurações editar [novo_nome]`');
            return;
        }

        const updated = await prisma.userName.update({
            where: { guildId: message.guildId },
            data: { name: newChannelName }
        })

        await message.reply(`✅ Nome do canal atualizado para: **${updated.name}**`);
        return
    }

    const existingChannelName = await prisma.userName.findUnique({
        where: { guildId: message.guildId },
        select: { name: true }
    })

    if (existingChannelName?.name) {
        const embed = new EmbedBuilder()
            .setColor('#7289da')
            .setTitle('🔧 Configurações de Notificações Twitch')
            .addFields(
                { name: 'Nome do Canal:', value: `${existingChannelName.name} ✅`, inline: false },
            )
            .addFields(
                { name: 'Editar Nome: ', value: '**Use:** `!verConfigurações editar [novo_nome]`', inline: false }
            )
            .setFooter({ text: 'Se precisar de ajuda, use `!comandos`' });

        await message.reply({ embeds: [embed] });
    } else {
        await message.reply('❌ Nenhuma configuração encontrada. Use `!configurar` para configurar as notificações.');
    }
}