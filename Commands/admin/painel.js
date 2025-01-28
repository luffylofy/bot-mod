const Discord = require("discord.js");
const config = require("../../config.json");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "painel",
    description: "Gerencie seu bot.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (interaction.user.id !== config.owner) {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(
                            `👋 Olá **${interaction.user}**, somente o \`Dono do bot\` pode utilizar este comando.`,
                        )
                        .setColor("Red"),
                ],
                flags: 64,
            });
            return;
        }

        const ping = client.ws.ping;

        const embedconfig = new Discord.EmbedBuilder()
            .setTitle("🇫 - Painel do seu BOT")
            .setColor(config.color)
            .setDescription(
                `Bom dia senhor(a) ${interaction.user}, o que deseja fazer?`,
            )
            .addFields(
                {
                    name: "Versão do Bot",
                    value: "1.0.0",
                },
                {
                    name: "Ping",
                    value: `\`${ping} MS\``,
                },
            );

        const botõesconfig1 = new Discord.ActionRowBuilder().addComponents(
            new Discord.StringSelectMenuBuilder()
                .setCustomId("painel")
                .setPlaceholder("Selecione uma opção")
                .setOptions(
                    {
                        label: "Configurações do BOT",
                        value: "bot",
                        emoji: "<:manager:1333763886213632072>",
                    },
                    {
                        label: "Gerenciar Sistema de Tickets",
                        value: "sistema",
                        emoji: "<:emoji_3:1333521232934731887>",
                    },
                    {
                        label: "Gerenciar Sistema de Vips",
                        value: "vips",
                        emoji: "<:foguete:1333531675816235031>",
                    },
                    {
                        label: "Gerenciar Permissões",
                        value: "permissoes",
                        emoji: "<:membro:1333531578302861405>",
                        desabled: true,
                    },
                ),
        );

        interaction.reply({
            embeds: [embedconfig],
            components: [botõesconfig1],
            flags: 64,
        });
    },
};
