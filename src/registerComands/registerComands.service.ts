import { Injectable, Logger } from "@nestjs/common";
import { Client, Message } from "discord.js";
import { commandsHandlers } from "../comands/commandsHandler";

@Injectable()
export class RegisterComandsService {
    private readonly logger = new Logger(RegisterComandsService.name);

    constructor() { }

    async registerComand(message: Message, client: Client) {
        const guildId = message.guildId;
        const guild = client.guilds.cache.get(guildId);

        if (guild) {
            const comands = this.getComandsForRegistration();
            guild.commands.set(comands)
                .then(() => this.logger.log('Comandos registrados com sucesso!'))
                .catch((error) => this.logger.error('Erro ao registrar comandos!', error));
        }
    }

    private getComandsForRegistration() {
        return Object.values(commandsHandlers).map((handler) => handler.data)
    }

}
