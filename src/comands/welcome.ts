import { Message } from "discord.js";

export async function MessageWelcome(message: Message) {
    const nameGuild = message.guild.name;

    try {
        await message.reply(`🎉 Olá, ${nameGuild}! Eu sou o **AlertifyBot**, e estou aqui para ajudar com as notificações da Twitch e muito mais. Para começar, use \`!comandos\` e veja todas as funcionalidades disponíveis. Caso queira configurar as notificações de quando o seu canal da Twitch estiver ao vivo, use \`!configurar\`! 🚀`);
    } catch {
        await message.reply('❌ Comando não reconhecido.');
    }
}