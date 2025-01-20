import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TwitchService {
    private readonly twitchClientId: string;
    private readonly twitchOauthToken: string;
    private readonly twitchApiUrl: string = 'https://api.twitch.tv/helix/streams';
    private readonly logger = new Logger(TwitchService.name);

    constructor(private configService: ConfigService) {
        this.twitchClientId = this.configService.get<string>('TWITCH_CLIENT_ID');
        this.twitchOauthToken = this.configService.get<string>('TWITCH_OAUTH_TOKEN');
        if (!this.twitchClientId || !this.twitchOauthToken) {
            throw new Error('Twitch credentials not found in environment variables');
        }
    }

    public async checkTwitchLiveStatus(twitchUserName: string) {
        if (!twitchUserName || typeof twitchUserName !== 'string') {
            throw new Error('Twitch username is invalid or not provided');
        }

        try {
            const response = await axios.get(this.twitchApiUrl, {
                params: { user_login: twitchUserName },
                headers: {
                    'Client-ID': this.twitchClientId,
                    'Authorization': `Bearer ${this.twitchOauthToken}`,
                },
            });
            if (response.data.data.length > 0) {
                const stream = response.data.data[0];
                return {
                    isLive: true,
                    message: `🎮 O dono do servidor está ao vivo na Twitch! Assista agora https://www.twitch.tv/${stream.user_name}`,
                    streamData: stream,
                };

            } else {
                return {
                    isLive: false,
                    message: `O canal ${twitchUserName} não está ao vivo no momento.`,
                };
            }
        } catch (error) {
            this.logger.error('Error checking Twitch live status', error.stack);
            return {
                isLive: false,
                message: 'Erro ao verificar o status da transmissão. Tente novamente mais tarde.',
            };
        }

    }
}
