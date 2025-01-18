import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ChannelType, Client, GatewayIntentBits, Message, TextChannel } from 'discord.js';
import { HandleConfigue } from '../comands/configure';
import { HandleSeeSettings } from '../comands/seeSettings';
import { HandleComands } from '../comands/comands';
import { TwitchService } from '../twitch/twitch.service';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmbedBuilder } from 'discord.js'
import { CommandsEnum } from 'src/utils/interface';

@Injectable()
export class BotService implements OnModuleInit {
    private client: Client;
    private userConfigs = new Map<string, any>();
    private readonly logger = new Logger(BotService.name);
    private readonly prefix = '!';

    constructor(
        private twitchSerivce: TwitchService,
        private configService: ConfigService) {
    }

    onModuleInit() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        });

        this.client.on('guildMemberAdd', async (member) => {
            await this.sendWelcomeMessage(member)
        })

        this.client.on('guildCreate', async (guild) => {
            const channel = guild.systemChannel || guild.channels.cache.find(ch => ch.type === ChannelType.GuildText);

            if (channel) {
                try {
                    await channel.send(`🎉 Olá, ${guild.name}! Eu sou o **AlertifyBot**, e estou aqui para ajudar com as notificações da Twitch e muito mais. Para começar, use \`!comandos\` e veja todas as funcionalidades disponíveis. Caso queira configurar as notificações de quando o seu canal da Twitch estiver ao vivo, use \`!configurar\`! 🚀`);
                } catch (error) {
                    this.logger.error('Erro ao enviar mensagem de boas-vindas.', error);
                }
            }
        });

        this.client.on('messageCreate', async (message: Message) => {
            if (message.author.bot || !message.guild) return;

            if (!message.content.startsWith(this.prefix)) return;

            if (message.guild.ownerId !== message.author.id) {
                await message.reply('Você não tem permissão para usar este comando.');
                return;
            }

            if (message.content.startsWith(`${this.prefix}configurar)`)) {
                await HandleConfigue(message, this.userConfigs);
            } else if (message.content.startsWith(`${this.prefix}verConfigurações`)) {
                await HandleSeeSettings(message, this.userConfigs);
            } else if (message.content.startsWith(`${this.prefix}comandos)`)) {
                await HandleComands(message)
            } 
        });

        try {
            this.client.login(process.env.BOT_TOKEN);
            this.logger.log('🚀 Bot iniciou com sucesso e está online! 🎮');
        } catch (error) {
            this.logger.error('Erro ao fazer login do bot:', error);
        }
    }

    private async sendWelcomeMessage(member: any) {
        const guild = member.guild;
        const channel = guild.channels.cache.find(
            (ch) => ch.name === 'boas-vindas' && ch instanceof TextChannel
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

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        const prisma = new PrismaClient();

        try {
            const channels = await prisma.userName.findMany({
                select: {
                    guildId: true,
                    channelId: true,
                    name: true,
                    liveNotified: true
                }
            })

            for (const channel of channels) {
                try {
                    if (!channel.channelId) {
                        this.logger.warn(`Canal não configurado para o servidor ${channel.guildId}`);
                        continue
                    }

                    const discordChannel = await this.client.channels.fetch(channel.channelId) as TextChannel;
                    if (!discordChannel) continue;

                    const status = await this.twitchSerivce.checkTwitchLiveStatus(channel.name);

                    if (status.isLive && !channel.liveNotified) {
                        const liveMessage = [
                            `🎮 **${channel.name}** está ao vivo!`,
                            `📺 **Título da live**: ${status.streamData.title}`,
                            `🎮 **Jogo**: ${status.streamData.game_name}`,
                            `🔗 **Assista agora**: [Clique aqui para assistir](https://www.twitch.tv/${channel.name})`,
                            `@everyone`
                        ].join('\n');


                        const sentMessage = await discordChannel.send(liveMessage);
                        try {
                            await sentMessage.pin()
                            this.logger.log(`Mensagem fixada no canal ${channel.channelId} do servidor ${channel.guildId}`);
                        } catch (pinError) {
                            this.logger.error(`Erro ao fixar a mensagem no canal ${channel.channelId} do servidor ${channel.guildId}`, pinError);
                        }

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
                            await discordChannel.send(`❌ O canal **${channel.name}** não está mais ao vivo.`);
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
