import { PrismaClient } from "@prisma/client";
import { ActionRowBuilder, CommandInteraction, MessageFlags, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";

const prisma = new PrismaClient()

export async function HandleEditChannelName(interaction: CommandInteraction) {

    try {
        const existingChannelName = await prisma.userName.findUnique({
            where: { guildId: interaction.guildId },
            select: { TwitchChannelName: true }
        })

        if (!existingChannelName) {
            await interaction.reply({
                content: '❌ Nenhum canal configurado. Use `/configurar` primeiro.',
                flags: MessageFlags.Ephemeral
            })
            return
        }

        const modal = new ModalBuilder()
            .setCustomId('configEditTwitchModal')
            .setTitle('Editar o nome do Canal')

        const twitchEditNameChannelInput = new TextInputBuilder()
            .setCustomId('editTwitchChannelName')
            .setLabel('Novo nome do canal da Twitch')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite o novo nome do canal')
            .setRequired(true)

        const firstActionRow = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(twitchEditNameChannelInput)

        modal.addComponents(firstActionRow)
        await interaction.showModal(modal)

        const modalResponse = await interaction.awaitModalSubmit({
            filter: (i: ModalSubmitInteraction) =>
                i.customId === 'configEditTwitchModal' && i.user.id === interaction.user.id,
            time: 60000
        })

        const newChannelName = modalResponse.fields.getTextInputValue('editTwitchChannelName')

        await prisma.userName.update({
            where: { guildId: interaction.guildId },
            data: { TwitchChannelName: newChannelName }
        })

        await modalResponse.reply({
            content: `✅ Nome do canal atualizado para: **${newChannelName}**.`,
            flags: MessageFlags.Ephemeral

        })
    } catch (error) {
        console.error(error)
        await interaction.reply({
            content: '❌ Ocorreu um erro ao processar o comando. Tente novamente mais tarde.',
            flags: MessageFlags.Ephemeral

        })
    } finally {
        await prisma.$disconnect()
    }
}