import { Injectable } from '@nestjs/common';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { HandleCommands } from '../comands/comands';
import { HandleConfigureTwitchChannelName } from '../comands/configure';
import { HandleEditChannelName } from '../comands/editChannelName';
import { HandleSeeSettings } from '../comands/seeSettings';
import { HandleMessageWelcome } from '../comands/welcome';
import { DeleteAccountService } from '../delete-account/deleteAccount.service';

@Injectable()
export class CommandsService {
    constructor(private readonly deleteAccount: DeleteAccountService) { }

    comandsHandler() {
        return {
            ola: {
                data: new SlashCommandBuilder()
                    .setName('ola')
                    .setDescription('Enviar uma mensagem de boas-vindas.'),
                execute: async (interaction: CommandInteraction) => await HandleMessageWelcome(interaction),
            },
            configurar: {
                data: new SlashCommandBuilder()
                    .setName('configurar')
                    .setDescription('Configurar as notificações da Twitch.'),
                execute: async (interaction: CommandInteraction) => await HandleConfigureTwitchChannelName(interaction),
            },
            verconfiguracoes: {
                data: new SlashCommandBuilder()
                    .setName('verconfiguracoes')
                    .setDescription('Mostrar suas configurações atuais.'),
                execute: async (interaction: CommandInteraction) => await HandleSeeSettings(interaction),
            },
            editarnomedocanal: {
                data: new SlashCommandBuilder()
                    .setName('editarnomedocanal')
                    .setDescription('Editar o nome do canal de notificações da Twitch.'),
                execute: async (interaction: CommandInteraction) => await HandleEditChannelName(interaction),
            },
            comandos: {
                data: new SlashCommandBuilder()
                    .setName('comandos')
                    .setDescription('Lista todos os comandos disponíveis.'),
                execute: async (interaction: CommandInteraction) => await HandleCommands(interaction),
            },
            deletarconta: {
                data: new SlashCommandBuilder()
                    .setName('deletarconta')
                    .setDescription('Excluir a conta associada ao bot. Tenha certeza antes de proceder!'),
                execute: async (interaction: CommandInteraction) => {
                    if (interaction.isCommand()) {
                        await this.deleteAccount.delete(interaction.guildId, interaction);
                    }
                }
            },

        }
    }
}
