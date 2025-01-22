import { PrismaClient } from "@prisma/client";
import { CommandInteraction, EmbedBuilder } from "discord.js";

export async function HandleSeeSettings(interaction: CommandInteraction) {
    const prisma = new PrismaClient();

    try {
        const existingChannelName = await prisma.userName.findUnique({
            where: { guildId: interaction.guildId },
            select: { name: true }
        });

        if (existingChannelName?.name) {
            const embed = new EmbedBuilder()
                .setColor('#7289da')
                .setTitle('🔧 Configurações de Notificações Twitch')
                .addFields(
                    { name: 'Nome do Canal:', value: `${existingChannelName.name} ✅`, inline: false },
                )
                .setFooter({ text: 'Se precisar de ajuda, use `/comandos`' });

            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({
                content: '❌ Nenhuma configuração encontrada para este servidor. Use `/config editar` para definir um nome.',
            });
        }
    } catch (error) {
        await interaction.reply({
            content: '❌ Ocorreu um erro ao processar o comando. Tente novamente mais tarde.',
        });
    } finally {
        await prisma.$disconnect();
    }
}
