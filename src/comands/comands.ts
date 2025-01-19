import { Message } from "discord.js";

export async function HandleComands(message: Message) {
    const comand = message.content.slice(1).toLocaleLowerCase();

    switch (comand) {
        case 'ping':
            await message.reply('Pong!')
            break
        case 'status':
            const serverInfo = [
                '**📊 Informações do Servidor**',
                `**Nome:** ${message.guild.name}`,
                `**Total de membros:** ${message.guild.memberCount}`,
                '**Status:** Bot está funcionando normalmente!'
            ].join('\n');
            await message.reply(serverInfo);
            break;
        case 'comandos':
            const helpMessage = [
                '🤖 **Comandos Disponíveis:**',
                '`!ola` - Mensagem de Apresentação',
                '`!configurar` - Configura as notificações da Twitch.',
                '`!verConfigurações` - Mostra suas configurações atuais.'
            ].join('\n');
            await message.reply(helpMessage);
            break
        default:
            await message.reply('❌ Comando não reconhecido')
    }

}