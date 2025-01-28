const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "slowmode", // Coloque o nome do comando
    description: "Configure o modo lento em um canal de texto.", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "tempo",
            description: "Coloque o tempo do modo lento [s|m|h].",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "canal",
            description: "Mencione um canal de texto.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: false,
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
            let t = interaction.options.getString("tempo");
            let tempo = ms(t);
            let channel = interaction.options.getChannel("canal");
            if (!channel || channel === null) channel = interaction.channel;

            if (!tempo || tempo === false || tempo === null) {
                interaction.reply({
                    content: `Forneça um tempo válido: [s|m|h].`,
                    flags: 64,
                });
            } else {
                channel
                    .setRateLimitPerUser(tempo / 1000)
                    .then(() => {
                        interaction.reply({
                            content: `O canal de texto ${channel} teve seu modo lento definido para \`${t}\`.`,
                        });
                    })
                    .catch(() => {
                        interaction.reply({
                            content: `Ops, algo deu errado ao executar este comando, verifique minhas permissões.`,
                            flags: 64,
                        });
                    });
            }
        }
    },
};
