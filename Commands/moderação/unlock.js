const Discord = require("discord.js");
const emojis = require("../../json/emojis.json");

module.exports = {
    name: "unlock",
    description: "Destranca o atual canal de texto.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canal",
            description: "Mencione um canal para ser destrancado.",
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
                ephemeral: true,
                content: `👋 Olá **${interaction.user}**, você não possui a permissão \`Gerenciar Canais\` para utilizar este comando.`,
            });
        } else {
            const channel = interaction.options.getChannel("canal");
            channel.permissionOverwrites
                .edit(interaction.guild.id, {
                    SendMessages: true,
                })
                .then(() => {
                    interaction.reply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setDescription(
                                    `${emojis.certo} | Olá **${interaction.user}**, este canal foi destrancado com sucesso.`,
                                )
                                .setColor("Green"),
                        ],
                        flags: 64,
                    });
                })
                .catch((err) => {
                    [
                        interaction.reply({
                            embeds: [
                                new Discord.EmbedBuilder()
                                    .setDescription(
                                        `${emojis.errado} | Olá **${interaction.user}**, não foi possível destrancar este canal.`,
                                    )
                                    .setColor("Red"),
                            ],
                            flags: 64,
                        }),
                    ];
                });
        }
    },
};
