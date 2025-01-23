import { PrismaClient } from "@prisma/client";
import { ActionRowBuilder, CommandInteraction, MessageFlags, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { validateUserConfig } from "../utils/validateUser";
const prisma = new PrismaClient();

export async function HandleConfigureTwitchChannelName(interaction: CommandInteraction) {

    try {
        const existingChannelName = await prisma.userName.findUnique({
            where: { guildId: interaction.guildId },
            select: { TwitchChannelName: true }
        })

        if (existingChannelName) {
            return interaction.reply({
                content: "❌ Canal da Twitch já configurado para este servidor.",
                flags: MessageFlags.Ephemeral
            })
        }

        const modal = new ModalBuilder()
            .setCustomId('configTwitchModal')
            .setTitle('Configurar Notificações da Twitch')

        const twitchChannelInput = new TextInputBuilder()
            .setCustomId('twitchChannelName')
            .setLabel('Nome do seu canal da Twitch')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite o nome do canal')
            .setRequired(true)

        const actionRow = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(twitchChannelInput)

        modal.addComponents(actionRow)
        await interaction.showModal(modal)

        try {
            const modalReponse = await interaction.awaitModalSubmit({
                filter: (i: ModalSubmitInteraction) =>
                    i.customId === 'configTwitchModal' && i.user.id === interaction.user.id,
                time: 60000
            })

            const twitchChannelName = modalReponse.fields.getTextInputValue('twitchChannelName')

            const userCOnfig = await prisma.userName.create({
                data: {
                    TwitchChannelName: twitchChannelName,
                    guildId: interaction.guildId,
                    DiscordChannelId: interaction.channelId
                }
            })

            const validConfig = await validateUserConfig(userCOnfig)
            const userConfigs = new Map<string, any>()
            userConfigs.set(interaction.guildId, validConfig)

            await modalReponse.reply({
                content: `✅ Canal da Twitch **${twitchChannelName}** registrado com sucesso!`,
                flags: MessageFlags.Ephemeral
            })
        } catch (submissionError) {
            console.error('Modal submission error:', submissionError);
            await interaction.followUp({
                content: "❌ Tempo expirado ou erro na configuração. Tente novamente.",
                flags: MessageFlags.Ephemeral
            });
        }

    } catch (configError) {
        console.error('Configuration error:', configError);
        await interaction.reply({
            content: "❌ Erro ao configurar o canal. Verifique os detalhes e tente novamente.",
            flags: MessageFlags.Ephemeral
        });
    } finally {
        await prisma.$disconnect();
    }
}