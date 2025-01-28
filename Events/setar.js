const Discord = require("discord.js");
const config = require("../config.json");
const emoji = require("../json/emojis.json");
const embed = new Discord.EmbedBuilder()
    .setColor(config.color)
    .setDescription("`Não definido.`");

module.exports = {
    name: "config-ticket",
    async execute(interaction) {
        if (interaction.customId) {
            const { user, channel } = interaction;
            // SISTEMA DE VIP
            if (interaction.isStringSelectMenu()) {
                if (interaction.values[0] === "add-titule") {
                    // Solicitar novo título
                    channel.send("Qual será o novo título?").then((msg1) => {
                        const filter = (m) => m.author.id === user.id;
                        const collector = msg1.channel.createMessageCollector({
                            filter,
                            max: 1,
                        });

                        collector.on("collect", (message) => {
                            message.delete();
                            embed.setTitle(message.content);
                            msg1.edit("Alterado!");
                            setTimeout(() => msg1.delete(), 1000);
                        });
                    });
                }

                    if (interaction.values[0] === "alterar-cor") {
                        // Solicitar nova cor
                        channel.send("Qual será a nova cor?").then((msg1) => {
                            const filter = (m) => m.author.id === user.id;
                            const collector = msg1.channel.createMessageCollector({
                                filter,
                                max: 1,
                            });

                            collector.on("collect", (message) => {
                                message.delete();
                                embed.setColor(message.content);
                                msg1.edit("Alterado!");
                                setTimeout(() => msg1.delete(), 1000);
                            });
                        });
                    }

                if (interaction.values[0] === "add-footer") {
                    // Solicitar novo rodapé
                    interaction.deferUpdate();
                    channel.send("Qual será o novo rodapé?").then((msg1) => {
                        const filter = (m) => m.author.id === user.id;
                        const collector = msg1.channel.createMessageCollector({
                            filter,
                            max: 1,
                        });

                        collector.on("collect", (message) => {
                            message.delete();
                            embed.setFooter({
                                text: message.content,
                                iconURL: interaction.guild.iconURL(),
                            });
                            msg1.edit("Alterado!");
                            setTimeout(() => msg1.delete(), 1000);
                        });
                    });
                }
                if (interaction.values[0] === "add-imagem") {
                    // Solicitar nova imagem
                    interaction.deferUpdate();
                    channel.send("Qual será a nova imagem?").then((msg1) => {
                        const filter = (m) => m.author.id === user.id;
                        const collector = msg1.channel.createMessageCollector({
                            filter,
                            max: 1,
                        });

                        collector.on("collect", (message) => {
                            message.delete();
                            embed.setImage(message.content);
                            msg1.edit("Alterado!");
                            setTimeout(() => msg1.delete(), 1000);
                        });
                    });
                }
                if (interaction.values[0] === "enviar_ticket") {
                    // Enviar o painel de ticket
                    channel
                        .send({
                            embeds: [embed],
                            components: [
                                new Discord.ActionRowBuilder().addComponents(
                                    new Discord.ButtonBuilder()
                                        .setCustomId("painel-ticket")
                                        .setLabel("Abrir Ticket")
                                        .setEmoji(
                                            "<:Ticket:1329772517715480689>",
                                        )
                                        .setStyle(1),
                                ),
                            ],
                        })
                        .then(() => {
                            interaction.reply({
                                content: `${emoji.certo} | Painel enviado com sucesso`,
                                flags: 64,
                            });
                        });
                }
                if (interaction.values[0] === "alterar-desc") {
                    // Solicitar nova descrição
                    interaction.deferUpdate();
                    channel.send("Qual será a nova descrição?").then((msg1) => {
                        const filter = (m) => m.author.id === user.id;
                        const collector = msg1.channel.createMessageCollector({
                            filter,
                            max: 1,
                        });

                        collector.on("collect", (message) => {
                            message.delete();
                            embed.setDescription(message.content);
                            msg1.edit("Alterado!");
                            setTimeout(() => msg1.delete(), 1000);
                        });
                    });
                }
                if (interaction.values[0] === "reiniciar-ticket") {
                    // Reiniciar as configurações do ticket
                    interaction.update({
                        embeds: [
                            new Discord.EmbedBuilder().setDescription(
                                "Configure o ticket antes de enviá-lo",
                            ),
                            embed,
                        ],
                    });
                }
            }
        }
    },
};