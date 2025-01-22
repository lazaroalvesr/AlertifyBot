import { PrismaClient } from "@prisma/client";
import { CommandInteraction } from "discord.js";

export async function HandleEditChannelName(interaction: CommandInteraction) {
    const prisma = new PrismaClient()

    const newName = (interaction.options as any).getString('canal')

    try {
        const existingChannelName = await prisma.userName.findUnique({
            where: { guildId: interaction.guildId },
        })

        if (!existingChannelName) {
            await interaction.reply({
                content: '❌ Nenhum nome de canal encontrado. Use `/configurar` para definir um nome.',
            })
            return
        }

        await prisma.userName.update({
            where: { guildId: interaction.guildId },
            data: { name: newName }
        })

        await interaction.reply({
            content: `✅ Nome do canal atualizado para: **${newName}**.`,
        })

    } catch (error) {
        await interaction.reply({
            content: '❌ Ocorreu um erro ao processar o comando. Tente novamente mais tarde.',
        })
    } finally {
        await prisma.$disconnect()
    }
}