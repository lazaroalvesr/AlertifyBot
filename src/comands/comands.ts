import { CommandInteraction, EmbedBuilder } from "discord.js";

export async function HandleCommands(interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    switch (commandName) {
        case 'comandos':
            const embed = new EmbedBuilder()
                .setColor('#7289da')
                .setTitle('🤖 **Comandos Disponíveis**')
                .addFields(
                    { name: '✨ `/ola`', value: '**Mensagem de Apresentação**', inline: false },
                    { name: '🔧 `/configurar`', value: '**Configura as notificações da Twitch**', inline: false },
                    { name: '📜 `/verconfiguracoes`', value: '**Mostra suas configurações atuais**', inline: false },
                )
                .setFooter({ text: '💡 Use os comandos acima para interagir com o bot e configurar suas preferências!' });

            await interaction.reply({ embeds: [embed] });
            break;

        default:
            await interaction.reply({ content: '❌ Comando não reconhecido' });
    }
}
