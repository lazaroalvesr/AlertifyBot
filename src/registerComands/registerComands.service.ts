import { Injectable, Logger } from "@nestjs/common";
import { Client, CommandInteraction, REST, Routes } from "discord.js";
import { CommandsService } from "../commands/commands.service";

@Injectable()
export class RegisterComandsService {
    private readonly logger = new Logger(RegisterComandsService.name)
    constructor(
        private readonly commandsService: CommandsService
    ) { }


    async registerComands(client: Client) {
        try {
            const comands = Object.values((await this.commandsService.comandsHandler()))
                .map(handler => handler.data.toJSON())

            const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: comands }
            )

            this.logger.log('✅ Comandos slash registrados com sucesso!');
        } catch (error) {
            this.logger.error('❌ Erro ao registrar comandos:', error);
        }
    }

    handleInteraction(interaction: CommandInteraction) {
        if (!interaction.isCommand()) return

        try {
            const handlers = this.commandsService.comandsHandler()
            const handler = handlers[interaction.commandName]

            if (handler) {
                handler.execute(interaction)
            }
        } catch (error) {
            this.logger.error('Erro ao processar o comando', error)
            interaction.reply({
                content: '❌ Houve um erro ao processar seu comando.',
            })
        }
    }
}
