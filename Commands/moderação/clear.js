const Discord = require("discord.js")
const emoji = require("../../json/emojis.json")
module.exports = {
    name: "clear", // Coloque o nome do comando
    description: "Limpe o canal de texto", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'quantidade',
            description: 'Número de mensagens para serem apagadas.',
            type: Discord.ApplicationCommandOptionType.Number,
            required: true,
        }
    ],

    run: async (client, interaction) => {

        let numero = interaction.options.getNumber('quantidade')

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
            interaction.reply({
                            embeds: [
                                new Discord.EmbedBuilder()
                                    .setDescription(
                                        `👋 Olá **${interaction.user}**, você não possui a permissão \`Gerenciar Mensagens\` para utilizar este comando.`,
                                    )
                                    .setColor("Red"),
                            ],
                            flags: 64,
                        });
        } else {

            if (parseInt(numero) > 99 || parseInt(numero) <= 0) {

                let embed = new Discord.EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`\`/clear [1 - 99]\``);

                interaction.reply({ embeds: [embed] })

            } else {

                interaction.channel.bulkDelete(parseInt(numero))

                let embed = new Discord.EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`${emoji.certo} | Foram apagadas ${numero} mensagens por ${interaction.user}.`);

                interaction.reply({ embeds: [embed] })

                let apagar_mensagem = "nao" // sim ou nao

                if (apagar_mensagem === "sim") {
                    setTimeout(() => {
                        interaction.deleteReply()
                    }, 5000)
                } else if (apagar_mensagem === "nao") {
                    return;
                }

            }

        }

    }
}