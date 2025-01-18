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
                '`!status` - Exibe informações sobre o status do bot e detalhes do servidor.',
                '`!configurar` - Configura o bot para enviar notificações quando o canal da Twitch estiver ao vivo.',
                '`!verConfigurações` - Exibe as configurações atuais da Twitch configuradas para o servidor.'
            ].join('\n');
            await message.reply(helpMessage);
            break
        default:
            await message.reply('❌ Comando não reconhecido')
    }

}