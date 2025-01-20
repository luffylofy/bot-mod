const Discord = require("discord.js");
const config = require("../../config.json");
const perms = require("../../json/perms.json");

module.exports = {
    name: "setar",
    description: "[🎟️] Envie o painel de tickets.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const userPermissions = perms[`${interaction.user.id}`];

        if (!userPermissions) {
            return interaction.reply({
                content: "Você não tem permissão para usar este comando.",
                flags: 64,
            });
        } else {
            const embed = new Discord.EmbedBuilder()
                .setColor(config.color)
                .setDescription("Ticket");
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
                        new Discord.ButtonBuilder()
                            .setCustomId("add-titule")
                            .setLabel("Título")
                            .setStyle(1),
                        new Discord.ButtonBuilder()
                            .setCustomId("alterar-desc")
                            .setLabel("Descrição")
                            .setStyle(1),
                        new Discord.ButtonBuilder()
                            .setCustomId("add-footer")
                            .setLabel("Rodapé")
                            .setStyle(1),
                        new Discord.ButtonBuilder()
                            .setCustomId("add-image")
                            .setLabel("Banner")
                            .setStyle(1),
                        new Discord.ButtonBuilder()
                            .setCustomId("enviar_ticket")
                            .setLabel("Enviar Ticket")
                            .setStyle(1),
                    ),
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("reiniciar-ticket")
                            .setLabel("Atualizar")
                            .setStyle(2),
                    ),
                ],
                flags: 64,
            });
        }
    },
};
