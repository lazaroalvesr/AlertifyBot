import { Injectable, Logger } from '@nestjs/common';
import { TwitchService } from '../twitch/twitch.service';
import { CommandInteraction, MessageFlags } from 'discord.js';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class StatusService {
    private readonly logger = new Logger(StatusService.name)
    private readonly twitchService: TwitchService

    constructor() { }

    async seeStatusChannel(interaction: CommandInteraction) {
        const prisma = new PrismaClient()

        try {

            const channelExisted = await prisma.userName.findUnique({
                where: { guildId: interaction.guildId }
            })

            if (!channelExisted) {
                this.logger.warn(`Canal não configurado para o servidor ${channelExisted.guildId}`);
                return
            }

            const status = await this.twitchService.checkTwitchLiveStatus(channelExisted.TwitchChannelName)

            console.log(`funcionou_> ${status.streamData}`)

        } catch (error) {
            await interaction.reply({
                content: '❌ Ocorreu um erro ao processar o comando. Tente novamente mais tarde.',
                flags: MessageFlags.Ephemeral

            })
        }
    }
}