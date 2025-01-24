import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ButtonInteraction, ChannelType, Client, EmbedBuilder, GatewayIntentBits, MessageFlags, TextChannel } from 'discord.js';
import { TwitchService } from '../twitch/twitch.service';
import { RegisterComandsService } from '../registerComands/registerComands.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { CommandsService } from '../commands/commands.service';
import { DeleteAccountService } from '../delete-account/deleteAccount.service';

@Injectable()
export class BotService implements OnModuleInit {
    private client: Client;
    private readonly logger = new Logger(BotService.name);

    constructor(
        private twitchService: TwitchService,
        private readonly registerComands: RegisterComandsService,
        private readonly commandService: CommandsService,
        private readonly deleteAccountService: DeleteAccountService
    ) {
        this.registerComands = registerComands;
    }

    onModuleInit() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        this.client.on('guildMemberAdd', async (member) => {
            await this.sendWelcomeMessage(member);
        });

        this.client.on('guildCreate', async (guild) => {
            const channel = guild.systemChannel || guild.channels.cache.find(ch => ch.type === ChannelType.GuildText);

            if (channel) {
                try {
                    await channel.send(`🎉 Olá, ${guild.name}! Eu sou o **AlertifyBot**, e estou aqui para ajudar com as notificações da Twitch e muito mais. Para começar, use \`/comandos\` e veja todas as funcionalidades disponíveis. Caso queira configurar as notificações de quando o seu canal da Twitch estiver ao vivo, use \`/configurar\` 🚀`);
                } catch (error) {
                    this.logger.error('Erro ao enviar mensagem de boas-vindas.', error);
                }
            }
        });

        this.client.once('ready', async () => {
            console.log(`🤖 Bot está online como ${this.client.user?.tag}!`);

            const guild = this.client.guilds.cache.first();
            if (guild) {
                await this.registerComands.registerComands(this.client);
            } else {
                console.error('Nenhuma guilda encontrada. Certifique-se de que o bot está em um servidor.');
            }
        });

        this.client.on('interactionCreate', async (interaction) => {
            try {
                if (interaction.isCommand()) {
                    if (interaction.guildId && interaction.user.id !== interaction.guild?.ownerId) {
                        await interaction.reply({
                            content: 'Você não tem permissão para executar esse comando.',
                            flags: MessageFlags.Ephemeral
                        })
                        return
                    }

                    const handler = (await this.commandService.comandsHandler())[interaction.commandName]

                    if (handler) {
                        await handler.execute(interaction)
                    } else {
                        await interaction.reply({
                            content: 'Comando não encontrado.',
                            flags: MessageFlags.Ephemeral
                        })
                    }
                } else if (interaction.isButton()) {
                    const buttonInteraction = interaction as ButtonInteraction
                    if (['confirm_delete', 'cancel_delete'].includes(buttonInteraction.customId)) {
                        await this.deleteAccountService.handleButtonInteraction(buttonInteraction)
                    }
                }
            } catch (error) {
                this.logger.error('Erro ao processar a interação', error)
                if (interaction.isRepliable()) {
                    await interaction.reply({
                        content: '❌ Houve um erro ao processar sua interação.',
                        flags: MessageFlags.Ephemeral
                    })
                }
            }
        })

        try {
            this.client.login(process.env.DISCORD_TOKEN);
            this.logger.log('🚀 Bot iniciou com sucesso e está online! 🎮');
        } catch (error) {
            this.logger.error('Erro ao fazer login do bot:', error);
        }
    }

    private async sendWelcomeMessage(member: any) {
        const guild = member.guild;
        const channel = guild.channels.cache.find(
            (ch: { name: string; }) => ch.name === 'boas-vindas' && ch instanceof TextChannel
        );

        if (channel) {
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`Seja bem-vindo, ${member.displayName}!`)
                .setDescription('Estamos felizes por tê-lo no nosso servidor!')
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();

            channel.send({ embeds: [embed] });
        }
    }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async handleCron() {
        const prisma = new PrismaClient();

        try {
            const channels = await prisma.userName.findMany({
                select: {
                    guildId: true,
                    DiscordChannelId: true,
                    TwitchChannelName: true,
                    liveNotified: true
                }
            })

            for (const channel of channels) {
                try {
                    if (!channel.DiscordChannelId) {
                        this.logger.warn(`Canal não configurado para o servidor ${channel.guildId}`);
                        continue
                    }

                    const discordChannel = await this.client.channels.fetch(channel.DiscordChannelId) as TextChannel;
                    if (!discordChannel) continue;

                    const status = await this.twitchService.checkTwitchLiveStatus(channel.TwitchChannelName);

                    if (status.isLive && !channel.liveNotified) {
                        const thumbnailUrl = status.streamData.thumbnail_url
                            .replace('{width}', '640')
                            .replace('{height}', '360');

                        const embed = new EmbedBuilder()
                            .setColor('#9146FF')
                            .setTitle(`🎮 **${channel.TwitchChannelName}** está ao vivo!`)
                            .setDescription(`📺 **Título da live**: ${status.streamData.title}`)
                            .addFields(
                                { name: '🎮 Jogo', value: `${status.streamData.game_name}`, inline: false },
                                { name: '🔗 Assista agora', value: `[Clique aqui para assistir](https://www.twitch.tv/${channel.TwitchChannelName})`, inline: false }
                            )
                            .setImage(thumbnailUrl)
                            .setFooter({
                                text: 'Transmitido ao vivo na Twitch',
                                iconURL: 'https://static.twitchcdn.net/assets/favicon-32-32-45108c924f5f3e7a7bcff3c54859921e.png'
                            })
                            .setTimestamp();

                        await discordChannel.send({
                            content: '@everyone',
                            embeds: [embed]
                        });

                        await prisma.userName.update({
                            where: { guildId: channel.guildId },
                            data: { liveNotified: true }
                        })
                    }

                    else if (!status.isLive && channel.liveNotified) {
                        await prisma.userName.update({
                            where: { guildId: channel.guildId },
                            data: { liveNotified: false }
                        }),
                            await discordChannel.send(`❌ O canal **${channel.TwitchChannelName}** não está mais ao vivo.`);
                    }
                } catch (error) {
                    this.logger.error(`Erro ao processar servidor ${channel.guildId}:`, error);
                }
            }
        } catch (error) {
            this.logger.error("Error no cron Job", error)
        } finally {
            await prisma.$disconnect()
        }
    }
}
