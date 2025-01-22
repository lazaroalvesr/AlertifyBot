import { PrismaClient } from "@prisma/client";
import { ActionRowBuilder, CommandInteraction, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { validateUserConfig } from "src/utils/validateUser";

export async function HandleConfigue(interaction: CommandInteraction) {
    const prisma = new PrismaClient();

    try {
        const existingChannelName = await prisma.userName.findUnique({
            where: { guildId: interaction.guildId },
            select: { name: true }
        })

        if (existingChannelName) {
            await interaction.reply({
                content: "❌ Nome do canal já preenchido.",
                ephemeral: true
            })
            return
        }

        const modal = new ModalBuilder()
            .setCustomId('configTwitchModal')
            .setTitle('Configurar canal da Twitch');

        const twitchChannelInput = new TextInputBuilder()
            .setCustomId('twitchChannelName')
            .setLabel('Nome do seu canal da twitch')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite o nome do seu canal')
            .setRequired(true)

        const firstActionRow = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(twitchChannelInput)

        modal.addComponents(firstActionRow);

        await interaction.showModal(modal)

        try {
            const filter = (i: ModalSubmitInteraction) =>
                i.customId === 'configTwitchModal' &&
                i.user.id === interaction.user.id

            const modalResponse = await interaction.awaitModalSubmit({
                filter,
                time: 60000
            })

            const twitchChannelName = modalResponse.fields.getTextInputValue('twitchChannelName');

            const input = await prisma.userName.create({
                data: {
                    name: twitchChannelName,
                    guildId: interaction.guildId,
                    channelId: interaction.channelId
                }
            })

            const validConfig = await validateUserConfig(input)

            const userConfigs = new Map<string, any>();
            userConfigs.set(interaction.guildId, validConfig);

            await modalResponse.reply({
                content: `✅ Canal **${twitchChannelName}** registrado com sucesso!`,
                ephemeral: true
            })
        } catch (error) {
            await interaction.followUp({
                content: "❌ Tempo expirado ou ocorreu um erro. Por favor, tente novamente.",
                ephemeral: true
            })
        }

    } catch (error) {
        await interaction.reply({
            content: "❌ Ocorreu um erro ao configurar o canal. Por favor, tente novamente.",
            ephemeral: true
        });
    } finally {
        await prisma.$disconnect();
    }
}