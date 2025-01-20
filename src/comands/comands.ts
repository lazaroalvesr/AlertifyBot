import { EmbedBuilder, Message } from "discord.js";

export async function HandleComands(message: Message) {
    const comand = message.content.slice(1).toLocaleLowerCase();

    switch (comand) {
        case 'comandos':
            const embed = new EmbedBuilder()
                .setColor('#7289da')
                .setTitle('🤖 **Comandos Disponíveis**')
                .addFields(
                    { name: '✨ `!ola`', value: '**Mensagem de Apresentação**', inline: false },
                    { name: '🔧 `!configurar`', value: '**Configura as notificações da Twitch**', inline: false },
                    { name: '📜 `!verConfigurações`', value: '**Mostra suas configurações atuais**', inline: false },
                )
                .setFooter({ text: '💡 Use os comandos acima para interagir com o bot e configurar suas preferências!' });

            await message.reply({ embeds: [embed] });
            break
        default:
            await message.reply('❌ Comando não reconhecido')
    }

}