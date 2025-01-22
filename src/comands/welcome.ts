import { CommandInteraction, EmbedBuilder } from "discord.js";

export async function HandleMessageWelcome(interaction: CommandInteraction) {
    const nameGuild = interaction.guild.name;

    try {
        const embed = new EmbedBuilder()
            .setColor('#7289da')
            .setTitle(`🎉 Olá, ${nameGuild}!`)
            .setDescription(`Sou o **AlertifyBot**, e estou aqui para ajudar com as notificações da Twitch e muito mais.`)
            .addFields(
                { name: '🔧 Ver Comandos', value: '`/comandos` - Veja todos os comandos disponíveis.', inline: false },
                { name: '🚀 Configurar Notificações', value: '`/configurar` - Configure notificações quando seu canal estiver ao vivo.', inline: false }
            )
            .setFooter({ text: 'Estou aqui para ajudar! Caso precise de algo, basta chamar!' });

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        await interaction.reply({
            content: '❌ Ocorreu um erro ao tentar enviar a mensagem. Tente novamente mais tarde.',
            ephemeral: true
        });
    }
}
