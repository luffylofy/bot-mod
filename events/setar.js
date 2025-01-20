const Discord = require("discord.js");
const config = require("../config.json")
const emoji = require("../json/emojis.json")

const embed = new Discord.EmbedBuilder()
.setColor(config.color)
.setDescription("Ticket")



module.exports = {
    name: 'config-ticket',
    async execute(interaction, message, client) {


        if (interaction.customId === "add-titule") {

            interaction.deferUpdate();

            interaction.channel.send({
                content: "Qual será o novo título?",
            }).then((msg1) => {
                const filter = (m) => m.author.id === interaction.user.id;
                const collector = msg1.channel.createMessageCollector({
                    filter,
                    max: 1,
                });

                collector.on("collect", (message) => {
                    message.delete();
                    embed.setTitle(message.content)
                    msg1.edit("Alterado!");
                    setTimeout(() => {
                        msg1.delete();
                    }, 1000);
                });
            });
        }

        if (interaction.customId === "add-footer") {

            interaction.deferUpdate();

            interaction.channel.send({
                content: "Qual será o novo rodapé?",
            }).then((msg1) => {
                const filter = (m) => m.author.id === interaction.user.id;
                const collector = msg1.channel.createMessageCollector({
                    filter,
                    max: 1,
                });

                collector.on("collect", (message) => {
                    message.delete();
                    embed.setFooter({
                        text: `${message.content}`, iconURL: interaction.guild.iconURL()
                    })

                    msg1.edit("Alterado!");
                    setTimeout(() => {
                        msg1.delete();
                    }, 1000);
                });
            });
        }
        if (interaction.customId === "add-image") {

            interaction.deferUpdate();

            interaction.channel.send({
                content: "Qual será a nova imagem?",
            }).then((msg1) => {
                const filter = (m) => m.author.id === interaction.user.id;
                const collector = msg1.channel.createMessageCollector({
                    filter,
                    max: 1,
                });

                collector.on("collect", (message) => {
                    message.delete();
                    embed.setImage(message.content)

                    msg1.edit("Alterado!");
                    setTimeout(() => {
                        msg1.delete();
                    }, 1000);
                });
            });
        }
        if (interaction.customId === "enviar_ticket") {

            interaction.channel.send({
                embeds: [embed],
                components: [
                    new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('painel-ticket')
                        .setLabel('Abrir Ticket')
                        .setEmoji('<:Ticket:1329772517715480689>')
                        .setStyle(1),
                        )
                    ]
            }).then(() => {
                interaction.reply({
                    content: `${emoji.certo} | Painel enviado com sucesso`,
                    ephemeral: true
                })
            })
        }
        if (interaction.customId === "alterar-desc") {

            interaction.deferUpdate();

            interaction.channel.send({
                content: "Qual será a nova descrição?",
            }).then((msg1) => {
                const filter = (m) => m.author.id === interaction.user.id;
                const collector = msg1.channel.createMessageCollector({
                    filter,
                    max: 1,
                });

                collector.on("collect", (message) => {
                    message.delete();
                    embed.setDescription(message.content)

                    msg1.edit("Alterado!");
                    setTimeout(() => {
                        msg1.delete();
                    }, 1000);
                });
            });
        }

        if (interaction.customId === "reiniciar-ticket") {
            interaction.update({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setDescription("Configure o ticket antes de enviá-lo"),
                    embed
                ]
            })
        }
    }}