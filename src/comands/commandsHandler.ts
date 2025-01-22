import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { HandleMessageWelcome } from "./welcome";
import { HandleConfigue } from "./configure";
import { HandleSeeSettings } from "./seeSettings";
import { HandleEditChannelName } from "./editChannelName";
import { HandleCommands } from "./comands";

export const commandsHandlers = {
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
        execute: async (interaction: CommandInteraction) => await HandleConfigue(interaction),
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
};
