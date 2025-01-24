import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CommandInteraction, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';

@Injectable()
export class DeleteAccountService {

    constructor() { }

    async delete(guildId: string, interaction: CommandInteraction) {
        console.log('Delete Command Debug:', {
            guildId,
            userId: interaction.user.id,
            userName: interaction.user.username
        });

        try {
            if (!guildId) {
                await interaction.reply({
                    content: "❌ Usuário não está cadastrado no bot",
                    flags: MessageFlags.Ephemeral
                })
                return
            }

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm_delete')
                    .setLabel('Sim, deletar minha conta')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('cancel_delete')
                    .setLabel('Cancelar')
                    .setStyle(ButtonStyle.Secondary)
            )

            await interaction.reply({
                content: '⚠️ Tem certeza que deseja deletar sua conta? Isso não pode ser desfeito!',
                components: [row],
                flags: MessageFlags.Ephemeral
            })
        } catch (error) {
            await interaction.reply({
                content: '❌ Houve um erro ao processar seu comando.',
                flags: MessageFlags.Ephemeral
            })
        }

    }
    async handleButtonInteraction(interaction: ButtonInteraction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'confirm_delete') {
            const prisma = new PrismaClient()

            try {
                const deleteAccount = await prisma.userName.delete({
                    where: { guildId: interaction.guildId },
                    select: { TwitchChannelName: true }
                })

                if (deleteAccount) {
                    await interaction.reply({
                        content: `✅ Conta apagada com sucesso! Para voltar a usar o bot, digite \`/configurar\`.`,
                        flags: MessageFlags.Ephemeral
                    })
                }
            } catch (error) {
                await interaction.reply({
                    content: '❌ Houve um erro ao processar seu comando.',
                    flags: MessageFlags.Ephemeral
                });
            }
        } else if (interaction.customId === 'cancel_delete') {
            await interaction.reply({
                content: '❌ A exclusão da conta foi cancelada.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
