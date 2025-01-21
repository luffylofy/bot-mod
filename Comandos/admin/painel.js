const Discord = require("discord.js");
const config = require("../../config.js");
const { ButtonBuilder,
    EmbedBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = {
    name: "painel",
    description: "[⚙️] Gerencie seu bot.",
    type: Discord.ApplicationCommandType.ChatInput,

        run: async (client, interaction) => {

            if (interaction.user.id !== config.owner) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`Apenas o dono do BOT pode usar esta função!`)
                            .setColor(config.color),
                    ],
                    flags: 64,
                });
                return;
            }

    const ping = client.ws.ping;

            const embedconfig = new Discord.EmbedBuilder()
            .setTitle("🇫 - Painel do seu BOT")
            .setColor(config.color)
            .setDescription(`Bom dia senhor(a) ${interaction.user}, o que deseja fazer?`)
            .addFields(
                {
                    name: "Versão do Bot", value: "1.0.0"
                },
                {
                    name: "Ping", value: `\`${ping} MS\``
                }
            )

            const botõesconfig1 = new Discord.ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("sistema")
                        .setLabel("Gerenciar Sistema de Tickets")
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji("⚙️")
                    );
            const botõesconfig2 = new Discord.ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("permissoes")
                        .setLabel("Gerenciar Permissões")
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji("🔑")
                    )
            const botõesconfig3 = new Discord.ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("vips")
                        .setLabel("Gerenciar Sistema de Vips")
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji("💎")
                    )

            interaction.reply({
                embeds: [embedconfig], components: [botõesconfig1, botõesconfig2, botõesconfig3], flags: 64
            })
        }
    }
