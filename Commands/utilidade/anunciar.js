const { EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle, ApplicationCommandOptionType } = require("discord.js");
const config = require('../../config.json');
const emojis = require('../../json/emojis.json');

module.exports = {
    name: 'anunciar',
    description: "[🛠] Envie um anuncio.",
    Permissions: [PermissionFlagsBits.ManageMessages],
    options: [
        {
            name: 'channel',
            description: 'Qual canal será enviado?',
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
    ],
    run: async (Client, interaction) => {
        let channel = interaction.options.getChannel('channel');
        let embed = new EmbedBuilder()
            .setTitle("Configure abaixo os campos da embed que deseja configurar.")
            .setFooter({ text: "Clique em cancelar para cancelar o anúncio." })
            .setColor(config.color);

        const send = new EmbedBuilder();

        const Message = await interaction.reply({
            embeds: [embed],
            components: [
                ...createActionRows([
                    ['title', '⠀Titulo'], ['desc', 'Descrição'], ['image', 'Imagem'], ['tumb', 'Miniatura'],
                    ['autor', '⠀Author⠀'], ['footer', '⠀Rodapé⠀'], ['date', '⠀Data⠀'], ['cor', '⠀Cor⠀'],
                    ['cancelar', 'Cancelar', ButtonStyle.Danger], ['send', '⠀⠀⠀⠀⠀Enviar⠀⠀⠀⠀⠀', ButtonStyle.Success],
                    ['previw', '⠀Preview⠀']
                ])
            ]
        });

        const collector = Message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 360_000 });

        collector.on('collect', i => {
            if (i.user.id === inter.user.id) {
                if (i.customId === 'cancelar') {
                    i.deferUpdate();
                    i.deleteReply();
                } else if (i.customId === 'previw' || i.customId === 'send') {
                    handlePreviewOrSend(i, send, i.customId === 'send' ? channel : null);
                } else {
                    handleModalInteraction(i, send);
                }
            }
        });

        function createActionRows(buttons) {
            const rows = [];
            for (let i = 0; i < buttons.length; i += 4) {
                const row = new ActionRowBuilder().addComponents(
                    ...buttons.slice(i, i + 4).map(([customId, label, style = ButtonStyle.Secondary]) =>
                        new ButtonBuilder().setCustomId(customId).setLabel(label).setStyle(style)
                    )
                );
                rows.push(row);
            }
            return rows;
        }

        function handlePreviewOrSend(i, send, channel = null) {
            i.deferUpdate();
            i.deleteReply();
            if (i.customId === 'previw') {
                i.reply({ embeds: [send], flags: 64 }).catch(err => handleError(i));
            } else if (i.customId === 'send' && channel) {
                channel.send({ embeds: [send], flags: 64 }).catch(err => handleError(i));
            }
        }

        function handleModalInteraction(i, send) {
            const fieldMap = {
                'title': { label: "Qual seria o titulo?", method: 'setTitle' },
                'desc': { label: "Qual seria a desc?", method: 'setDescription' },
                'image': { label: "Qual seria a imagem? Coloque link", method: 'setImage' },
                'tumb': { label: "Qual seria a Tumb? Coloque link", method: 'setThumbnail' },
                'autor': { label: "Qual seria o autor?", method: 'setAuthor', isAuthor: true },
                'footer': { label: "Qual seria o footer?", method: 'setFooter' },
                'cor': { label: "Coloque a cor com hexadecimal", method: 'setColor' }
            };

            const field = fieldMap[i.customId];
            if (field) {
                const date = 'edit_' + Date.now();
                const collectorFilter = i => i.user.id === inter.user.id && i.customId === date;

                const modal = new ModalBuilder()
                    .setCustomId(date)
                    .setTitle(field.label)
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('text')
                                .setLabel(field.label)
                                .setStyle(TextInputStyle.Short)
                        )
                    );

                i.showModal(modal);
                i.awaitModalSubmit({ time: 600_000, filter: collectorFilter })
                    .then(interaction => {
                        interaction.deferUpdate();
                        const value = interaction.fields.getTextInputValue('text');
                        if (field.isAuthor) {
                            send.setAuthor({ name: value });
                        } else {
                            send[field.method](value);
                        }
                    })
                    .catch(handleError);
            }
        }

        function handleError(i) {
            interaction.reply({
                content: `${emojis.errado} **|** Houve um erro ao processar o anúncio`,
                flags: 64
            });
        }
    }
};
