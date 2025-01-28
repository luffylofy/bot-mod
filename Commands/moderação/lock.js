const Discord = require("discord.js");
const emojis = require("../../json/emojis.json");

module.exports = {
    name: "lock",
    description: "Tranca o atual canal de texto.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canal",
            description: "Mencione um canal para ser trancado.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        if (
            !interaction.member.permissions.has(
                Discord.PermissionFlagsBits.ManageChannels,
            )
        ) {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(
                            `👋 Olá **${interaction.user}**, você não possui a permissão \`Gerenciar Canais\` para utilizar este comando.`,
                        )
                        .setColor("Red"),
                ],
                flags: 64,
            });
        } else {
            const channel = interaction.options.getChannel("canal");
            channel.permissionOverwrites
                .edit(interaction.guild.id, {
                    SendMessages: false,
                })
                .then(() => {
                    interaction.reply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setDescription(
                                    `${emojis.certo} | Este canal foi trancado por ${interaction.user}`,
                                )
                                .setColor("Green"),
                        ],
                        flags: 64,
                    });
                })
                .catch((err) => {
                    interaction.reply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setDescription(
                                    `${emojis.errado} | Ocorreu um erro ao tentar trancar este canal.`,
                                )
                                .setColor("Red"),
                        ],
                        flags: 64,
                    });
                });
        }
    },
};
