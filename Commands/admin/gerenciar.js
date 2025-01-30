const Discord = require('discord.js');
const config = require('../../config.json');
const emojis = require('../../json/emojis.json');

module.exports = {
		name: "gerenciar",
		description: "Gerencie seus membros.",
		type: Discord.ApplicationCommandType.ChatInput,
          options: [
            {
                name: "user",
                description: "Mencione um usuário para gerenciar.",
                type: Discord.ApplicationCommandOptionType.User,
                required: true,
            },
        ],

		run: async (client, interaction) => {
                if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {

                interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setDescription(
                                `👋 Olá **${interaction.user}**, você não possui a permissão \`Banir Membros\` para utilizar este comando.`)
                            .setColor("Red")
                    ],
                    flags: 64,
                });    } else {
                    const user = interaction.options.getUser("user");
                    const dataCriação = interaction.user.createdAt.toLocaleDateString("pt-br");
                    interaction.reply({
                        embeds: [
                            new Discord.EmbedBuilder()
                            .setDescription(`${emojis.pessoa} **Membro:** \`${user.username}\`\n${emojis.id} **ID:** \`${user.id}\`\n${emojis.calendario} **Data de Criação da conta:** \`${dataCriação}\``)                                
                            .setColor(config.color)
                        ],
                        components: [
                            new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                .setLabel("Banir")
                                .setCustomId("banir")
                                .setEmoji(emojis.banir)
                                .setStyle(Discord.ButtonStyle.Danger),
                                new Discord.ButtonBuilder()
                                .setLabel("Expulsar")
                                .setCustomId("kick")
                                .setEmoji(emojis.sair)
                                .setStyle(Discord.ButtonStyle.Danger),
                                new Discord.ButtonBuilder()
                                .setLabel("Silenciar")
                                .setCustomId("mute")
                                .setEmoji(emojis.silenciar)
                                .setStyle(Discord.ButtonStyle.Danger)
                            ),
                        ], flags: 64
                    })
                }
		},
};