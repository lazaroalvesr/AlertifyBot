import { Message, EmbedBuilder } from "discord.js";

export async function MessageWelcome(message: Message) {
    const nameGuild = message.guild.name;

    try {
        // Criando o embed para a mensagem de boas-vindas
        const embed = new EmbedBuilder()
            .setColor('#7289da') // Cor do embed
            .setTitle(`🎉 Olá, ${nameGuild}!`)
            .setDescription(`Sou o **AlertifyBot**, e estou aqui para ajudar com as notificações da Twitch e muito mais.`)
            .addFields(
                { name: '🔧 Ver Comandos', value: '`!comandos` - Veja todos os comandos disponíveis.', inline: false },
                { name: '🚀 Configurar Notificações', value: '`!configurar` - Configure notificações quando seu canal estiver ao vivo.', inline: false }
            )
            .setFooter({ text: 'Estou aqui para ajudar! Caso precise de algo, basta chamar!' });

        // Enviando o embed
        await message.reply({ embeds: [embed] });
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        await message.reply('❌ Ocorreu um erro ao tentar enviar a mensagem. Tente novamente mais tarde.');
    }
}
