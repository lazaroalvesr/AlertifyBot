import { Injectable } from '@nestjs/common';
import { CommandInteraction, GuildTextBasedChannel, MessageFlags } from 'discord.js';

@Injectable()
export class ClearBotMessageService {
    constructor() { }

    async clear(interaction: CommandInteraction) {
        try {
            const channel = interaction.channel as GuildTextBasedChannel;

            if (!channel) {
                await interaction.reply({
                    content: '❌ Não foi possível acessar o canal.',
                    flags: MessageFlags.Ephemeral
                })
                return
            }

            const messages = await channel.messages.fetch({ limit: 100 })

            const botMessages = messages.filter((msg) => msg.author.id === interaction.client.user?.id)

            await interaction.channel.bulkDelete(botMessages, true)

            await interaction.reply({
                content: `✅ ${botMessages.size} mensagens do bot foram apagadas.`,
                flags: MessageFlags.Ephemeral
            })
        } catch (error) {
            console.error('Erro ao limpar mensagens', error)
            await interaction.reply({
                content: '❌ Houve um erro ao tentar apagar as mensagens.',
                flags: MessageFlags.Ephemeral
            })
        }
    }
}
