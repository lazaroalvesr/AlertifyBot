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
import { MessageWelcome } from 'src/comands/welcome';

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

        const comandsHandlers = {
            ola: async (message: Message) => await MessageWelcome(message),
            configurar: async (message: Message, userConfigs: Map<string, any>) => await HandleConfigue(message, userConfigs),
            verConfigurações: async (message: Message) => await HandleSeeSettings(message),
            comandos: async (message: Message) => await HandleComands(message)
        }


        this.client.on('messageCreate', async (message: Message) => {
            if (message.author.bot || !message.guild) return;

            if (!message.content.startsWith(this.prefix)) return;

            if (message.guild.ownerId !== message.author.id) {
                await message.reply('Você não tem permissão para usar este comando.');
                return;
            }

            const [command, ...args] = message.content.slice(this.prefix.length).trim().split(/\s+/);

            const handler = comandsHandlers[command];

            if (handler) {
                await handler(message, args)
            } else {
                await message.reply('❌ Comando não reconhecido. Use `!comandos` para ver os comandos disponíveis.');
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
                        const embed = new EmbedBuilder()
                            .setColor('#9146FF') 
                            .setTitle(`🎮 **${channel.name}** está ao vivo!`)
                            .setDescription(`📺 **Título da live**: ${status.streamData.title}`)
                            .addFields(
                                { name: '🎮 Jogo', value: `${status.streamData.game_name}`, inline: false },
                                { name: '🔗 Assista agora', value: `[Clique aqui para assistir](https://www.twitch.tv/${channel.name})`, inline: false }
                            )
                            .setFooter({ text: 'Transmitido ao vivo na Twitch', iconURL: 'https://static.twitchcdn.net/assets/favicon-32-32-45108c924f5f3e7a7bcff3c54859921e.png' })
                            .setTimestamp();

                        const liveMessage = await discordChannel.send({
                            content: '@everyone',  
                            embeds: [embed],
                        });

                        await liveMessage.pin();

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
