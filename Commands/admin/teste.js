const Discord = require("discord.js");
const config = require("../../config.json");
const perms = require("../../json/perms.json");

module.exports = {
    name: "setar_painel",
    description: "Envie o painel de tickets.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const userPermissions = perms[`${interaction.user.id}`];

        if (!userPermissions) {
            return interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setDescription(
                                `👋 Olá **${interaction.user}**, você não possui a permissão \`Configurar Bot\` para utilizar este comando.`)
                            .setColor("Red")
                    ],
                    flags: 64,
                });
        } else {
            const embed = new Discord.EmbedBuilder()
                .setColor(config.color)
                .setDescription("`Não definido.`");
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription("Configure o ticket antes de enviá-lo")
                        .setFooter({
                            text: "Se você já fez alguma alteração anterior, clique em atualizar",
                        }),
                    embed,
                ],
                components: [
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId("ticket_options")
                            .setPlaceholder("Selecione uma opção")
                            .setMinValues(1)
                            .setMaxValues(1)
                            .setOptions(
                                {
                                    label: "Título",
                                    value: "add-titule",
                                    emoji: "<:custom:1333531876421271747>",
                                },
                                {
                                    label: "Descrição",
                                    value: "alterar-desc",
                                    emoji: "<:papel:1333763503466745940>",
                                },
                                {
                                    label: "Cor",
                                    value: "alterar-cor",
                                    emoji: "<:cores:1333760253241851914>",
                                },
                                {
                                    label: "Rodapé",
                                    value: "add-footer",
                                    emoji: "<:email:1333763593115799602>",
                                },
                                {
                                    label: "Banner",
                                    value: "add-image",
                                    emoji: "<:banner:1333760998569414656>",
                                },
                                {
                                    label: "Enviar Ticket",
                                    value: "enviar_ticket",
                                    emoji: "<:seta:1333764063334891581>",
                                },
                                {
                                    label: "Atualizar",
                                    value: "reiniciar-ticket",
                                    emoji: '<a:carregando:1333762105383583775>',
                                },
                            ),
                    ),
                ],

                flags: 64,
            });
        }
    },
};