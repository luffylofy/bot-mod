const Discord = require("discord.js");
const ticket = require("../json/config.ticket.json");
const emoji = require("../json/emojis.json");
const { QuickDB } = require("quick.db");
const db = new QuickDB({
    table: "ticket",
});
const transcript = require("discord-html-transcripts");
const randomString = require("randomized-string");
const fs = require("fs");
const assumedFilePath = "json/assumidos.json";
function readAssumedData() {
    try {
        const data = fs.readFileSync(assumedFilePath, "utf8");
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}
function saveAssumedData(data) {
    fs.writeFileSync(assumedFilePath, JSON.stringify(data, null, 4), "utf8");
}

module.exports = {
    name: "ticket",
    async execute(interaction) {
        const rawData = fs.readFileSync("json/config.ticket.json");
        const config = JSON.parse(rawData);

        if (interaction.isButton() && interaction.customId === "painel-ticket") {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setColor("#2b2d30")
                    .setDescription(`*Selecione o tipo de ticket que você deseja criar selecionando no menu abaixo.*`),
                ],
                components: [
                    new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                        .setCustomId("abrir-ticket")
                        .setPlaceholder("Selecione a categoria:")
                        .addOptions([{
                            label: "Realizar Suporte",
                            description: "Tickets relacionados a suporte apenas.",
                            emoji: "☎️",
                            value: "suporte"
                        },
                            {
                                label: "Reportar Bugs",
                                description: "Tickets relacionados a reportar bugs apenas.",
                                emoji: "📡",
                                value: "bugs"
                            }])
                    )
                ],
                ephemeral: true
            })

        }

        if (interaction.customId === "abrir-ticket") {

            const cleanUsername = interaction.user.username
                .toLowerCase()
                .replace(/[\s._]/g, "");

            const channel = interaction.guild.channels.cache.find(
                (c) => c.name === `📁・ticket-${cleanUsername}`,
            );

            if (channel)
                return interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.color)
                            .setDescription(
                                `${emoji.errado} ${interaction.user} Você já possui um ticket aberto em ${channel}.`,
                            ),
                    ],
                    components: [
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                                .setLabel("Ir para o seu Ticket")
                                .setStyle(Discord.ButtonStyle.Link)
                                .setURL(channel.url),
                        ),
                    ],
                    flags: 64,
                });

            const modal = new Discord.ModalBuilder()
                .setCustomId("modal_ticket")
                .setTitle("Sistema de Tickets");

            const text = new Discord.TextInputBuilder()
                .setCustomId("motivo")
                .setLabel("QUAL É O MOTIVO DO TICKET?")
                .setPlaceholder("Dúvida")
                .setStyle(1);

            modal.addComponents(
                new Discord.ActionRowBuilder().addComponents(text),
            );

            return interaction.showModal(modal);
        }

        if (
            interaction.isModalSubmit() &&
            interaction.customId === "modal_ticket"
        ) {
            const motivo = interaction.fields.getTextInputValue("motivo");
            const permissionOverwrites = [
                {
                    id: interaction.guild.id,
                    deny: ["ViewChannel"],
                },
                {
                    id: interaction.user.id,
                    allow: [
                        "ViewChannel",
                        "SendMessages",
                        "AttachFiles",
                        "AddReactions",
                    ],
                },
                {
                    id: ticket.config_principais.cargo_staff,
                    allow: [
                        "ViewChannel",
                        "SendMessages",
                        "AttachFiles",
                        "AddReactions",
                    ],
                },
            ];

            await db.add(`quantiaticket_${interaction.user.id}`, 1);

            var randomToken = randomString
                .generate({
                    length: 6,
                    charset: "hex",
                })
                .toUpperCase();
            const aaaaa = randomToken;
            const cargo_staff = interaction.guild.roles.cache.get(
                ticket.config_principais.cargo_staff,
            );
            const channel = await interaction.guild.channels
                .create({
                    name: `📁・ticket-${interaction.user.username}`,
                    type: 0,
                    parent: ticket.config_principais.categoria_ticket,
                    topic: interaction.user.id,
                    permissionOverwrites: permissionOverwrites,
                })
                .then((channels) => {
                    interaction.update({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor("#2b2d30")
                                .setDescription(
                                    `Seu ticket foi criado com sucesso no canal: ${channels.url}`,
                                ),
                        ],
                        components: [
                            new Discord.ActionRowBuilder().addComponents(
                                new Discord.ButtonBuilder()
                                    .setStyle(5)
                                    .setURL(channels.url)
                                    .setLabel("Ir para o ticket"),
                            ),
                        ],
                        flags: 64,
                    });
                    const user = interaction.user;
                    db.set(`ticket_${channels.id}`, {
                        usuario: interaction.user.id,
                        motivo: motivo,
                        codigo: aaaaa,
                        staff: "Ninguem Assumiu",
                    });

                    function substituirVariaveis(texto, user, motivo, aaaaa) {
                        return texto
                            .replace("{user}", user)
                            .replace("{motivo}", motivo)
                            .replace("{assumido}", `Ninguem assumiu`)
                            .replace("{codigo}", aaaaa);
                    }

                    const embeds = new Discord.EmbedBuilder().setDescription(
                        substituirVariaveis(
                            config.config_dentro.texto,
                            user,
                            motivo,
                            aaaaa,
                        ),
                    );

                    if (ticket.config_dentro.banner) {
                        embeds.setImage(`${ticket.config_dentro.banner}`);
                    }

                    channels.send({
                        content: `# TICKET - ${interaction.user.username}`,
                        embeds: [embeds],
                        components: [
                            new Discord.ActionRowBuilder().addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId("sair_ticket")
                                    .setLabel("Sair do Canal")
                                    .setStyle(1),
                                new Discord.ButtonBuilder()
                                    .setCustomId("painel_staff")
                                    .setLabel("Painel Staff")
                                    .setStyle(2),
                                new Discord.ButtonBuilder()
                                    .setCustomId("painel_member")
                                    .setLabel("Painel Membro")
                                    .setStyle(2),
                                new Discord.ButtonBuilder()
                                    .setCustomId("ticket_assumir")
                                    .setLabel("Assumir Ticket")
                                    .setStyle(2),
                                new Discord.ButtonBuilder()
                                    .setCustomId("finalization_ticket")
                                    .setLabel("Finalizar Ticket")
                                    .setStyle(Discord.ButtonStyle.Danger),
                            ),
                        ],
                    });
                    const chanal = interaction.guild.channels.cache.get(
                        ticket.config_principais.canal_logs,
                    );
                    if (!chanal) return;
                    chanal.send({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor("#2b2d30")
                                .setDescription(
                                    `👋 | O membro ${user} abriu um ticket! Você pode acessá-lo [clicando aqui](${channels.url})`,
                                ),
                        ],
                        components: [
                            new Discord.ActionRowBuilder().addComponents(
                                new Discord.ButtonBuilder()
                                    .setLabel("Ir Para o Ticket")
                                    .setStyle(Discord.ButtonStyle.Link)
                                    .setURL(channels.url),
                            ),
                        ],
                    });
                });
        }

        if (interaction.customId === "painel_staff") {
            if (
                !interaction.member.permissions.has(
                    Discord.PermissionFlagsBits.ManageMessages,
                )
            ) {
                interaction.reply({
                    content: `${emoji.errado} Você não possui permissão para utilizar esta opção.`,
                    flags: 64,
                });
            } else {
                interaction.reply({
                    embeds: [],
                    flags: 64,
                    components: [
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.StringSelectMenuBuilder()
                                .setCustomId("painelstaff")
                                .setPlaceholder("Escolha alguma opção")
                                .addOptions(
                                    {
                                        label: "Notificar Usuário",
                                        description:
                                            "Notifique o Usuário que abriu o ticket.",
                                        emoji: "🔔",
                                        value: "Cham_User",
                                    },
                                    {
                                        label: "Adicionar um Usuário",
                                        description:
                                            "Adicione um Usuário ao ticket.",
                                        emoji: "➕",
                                        value: "add_user",
                                    },
                                    {
                                        label: "Renomear Ticket",
                                        description: "Altere o nome do ticket.",
                                        emoji: "✏️",
                                        value: "renomear",
                                    },

                                    {
                                        label: "Remova um Usuário",
                                        description:
                                            "Remova um Usuário do ticket.",
                                        emoji: "➖",
                                        value: "remove_user",
                                    },
                                ),
                        ),
                    ],
                });
            }
        }

        if (
            interaction.isStringSelectMenu() &&
            interaction.customId === "painelstaff"
        ) {
            const options = interaction.values[0];
            const tickets = await db.get(`ticket_${interaction.channel.id}`);
            const usuario = tickets.usuario;
            const user = interaction.guild.members.cache.get(usuario);
            const motivo = tickets.motivo;
            const codigo = tickets.codigo;
            const staff = interaction.guild.members.cache.get(tickets.staff);

            if (options === "Cham_User") {
                user.send({
                    content: `O Staff ${interaction.user}, está lhe chamando, veja o motivo no ticket: ${interaction.channel.url}`,
                    components: [
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                                .setLabel("Ir para o ticket")
                                .setStyle(5)
                                .setURL(interaction.channel.url),
                        ),
                    ],
                });

                interaction.reply({
                    content: `${emoji.certo} | Usuário está notificado.`,
                    flags: 64,
                });
            }

            if (options === "add_user") {
                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder().setDescription(
                            `👤 | Marce ou envie o ID do usuário que você deseja adicionar!`,
                        ),
                    ],
                    components: [],
                    flags: 64,
                });

                const filter = (i) => i.member.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({
                    filter,
                });

                collector.on("collect", async (collect) => {
                    const user_content = await collect.content;
                    collect.delete();

                    const user_collected =
                        interaction.guild.members.cache.get(user_content);

                    if (!user_collected)
                        return interaction.editReply({
                            embeds: [
                                new Discord.EmbedBuilder().setDescription(
                                    `${emoji.errado} Não foi possível encontrar o usuário \`${user_content}\`, tente novamente!`,
                                ),
                            ],
                            components: [],
                            flags: 64,
                        });

                    if (
                        interaction.channel
                            .permissionsFor(user_collected.id)
                            .has("ViewChannel")
                    )
                        return interaction.editReply({
                            embeds: [
                                new Discord.EmbedBuilder().setDescription(
                                    `${emoji.errado} | O usuário ${user_collected}(\`${user_collected.id}\`) já possui acesso ao ticket!`,
                                ),
                            ],
                            components: [],
                            flags: 64,
                        });

                    const permissionOverwrites = [
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"],
                        },
                        {
                            id: user.id,
                            allow: [
                                "ViewChannel",
                                "SendMessages",
                                "AttachFiles",
                                "AddReactions",
                                "ReadMessageHistory",
                            ],
                        },
                        {
                            id: user_collected.id,
                            allow: [
                                "ViewChannel",
                                "SendMessages",
                                "AttachFiles",
                                "AddReactions",
                                "ReadMessageHistory",
                            ],
                        },
                        {
                            id: ticket.config_principais.cargo_staff,
                            allow: [
                                "ViewChannel",
                                "SendMessages",
                                "AttachFiles",
                                "AddReactions",
                                "ReadMessageHistory",
                            ],
                        },
                    ];

                    await interaction.channel.edit({
                        permissionOverwrites: permissionOverwrites,
                    });

                    interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder().setDescription(
                                `${emoji.certo} | O usuário ${user_collected}(\`${user_collected.id}\`) foi adicionado com sucesso!`,
                            ),
                        ],
                        components: [],
                        flags: 64,
                    });

                    collector.stop();
                });
            }

            if (options === "renomear") {
                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder().setDescription(
                            `**❓ | Digite o novo nome do canal abaixo:**`,
                        ),
                    ],
                    components: [],
                    flags: 64,
                });

                const filter = (i) => i.member.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({
                    filter,
                });

                collector.on("collect", async (collect) => {
                    const new_name = await collect.content;
                    collect.delete();

                    interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder().setDescription(
                                `${emoji.certo} | O nome do canal foi renomeado para: \`${new_name}\`.`,
                            ),
                        ],
                        components: [],
                        flags: 64,
                    });

                    interaction.channel.edit({
                        name: `ticket-${new_name}`,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: ["ViewChannel"],
                            },
                            {
                                id: interaction.user.id,
                                allow: [
                                    "ViewChannel",
                                    "SendMessages",
                                    "AttachFiles",
                                    "AddReactions",
                                ],
                            },
                            {
                                id: ticket.config_principais.cargo_staff,
                                allow: [
                                    "ViewChannel",
                                    "SendMessages",
                                    "AttachFiles",
                                    "AddReactions",
                                ],
                            },
                        ],
                    });
                    await collector.stop();
                });
            }

            if (options === "remove_user") {
                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder().setDescription(
                            `👤 | Marce ou envie o ID do usuário que você deseja remover!`,
                        ),
                    ],
                    components: [],
                    flags: 64,
                });

                const filter = (i) => i.member.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({
                    filter,
                });

                collector.on("collect", async (collect) => {
                    const user_content = await collect.content;
                    collect.delete();

                    const user_collected =
                        interaction.guild.members.cache.get(user_content);

                    if (!user_collected)
                        return interaction.editReply({
                            embeds: [
                                new Discord.EmbedBuilder().setDescription(
                                    `${emoji.errado} | Não foi possível encontrar o usuário \`${user_content}\`, tente novamente!`,
                                ),
                            ],
                            components: [],
                            flags: 64,
                        });

                    if (
                        !interaction.channel
                            .permissionsFor(user_collected.id)
                            .has("ViewChannel")
                    )
                        return interaction.editReply({
                            embeds: [
                                new Discord.EmbedBuilder().setDescription(
                                    ` O usuário ${user_collected}(\`${user_collected.id}\`) não possui acesso ao ticket!`,
                                ),
                            ],
                            components: [],
                            flags: 64,
                        });
                    const cargoIDs = ticket.config_principais.cargo_staff;
                    const permissionOverwrites = [
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"],
                        },
                        {
                            id: user_collected.id,
                            denny: ["ViewChannel"],
                        },
                        {
                            id: user.id,
                            allow: [
                                "ViewChannel",
                                "SendMessages",
                                "AttachFiles",
                                "AddReactions",
                                "ReadMessageHistory",
                            ],
                        },
                        {
                            id: cargoIDs,
                            allow: [
                                "ViewChannel",
                                "SendMessages",
                                "AttachFiles",
                                "AddReactions",
                                "ReadMessageHistory",
                            ],
                        },
                    ];

                    await interaction.channel.edit({
                        permissionOverwrites: permissionOverwrites,
                    });

                    interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder().setDescription(
                                `${emoji.certo} | O usuário ${user_collected}(\`${user_collected.id}\`) foi removido com sucesso!`,
                            ),
                        ],
                        components: [],
                        flags: 64,
                    });

                    collector.stop();
                });
            }
        }

        if (interaction.customId === "finalization_ticket") {
            const tickets = await db.get(`ticket_${interaction.channel.id}`);
            const usuario = tickets.usuario;
            const user = interaction.guild.members.cache.get(usuario);
            const motivo = tickets.motivo;
            const codigo = tickets.codigo;
            const logs = interaction.guild.channels.cache.get(
                ticket.config_principais.canal_logs,
            );
            const assumiu = interaction.guild.members.cache.get(tickets.staff);
            const assumiu1 = tickets.staff;

            const user1 = interaction.guild.members.cache.get(
                interaction.user.id,
            );

            if (
                !interaction.member.permissions.has(
                    Discord.PermissionFlagsBits.ManageMessages,
                )
            ) {
                interaction.reply({
                    content: `${emoji.errado} | Você não possui permissão para utilizar este botão.`,
                    flags: 64,
                });
            } else {
                interaction.reply({
                    content: `Este ticket será excluído em \`5 segundos\``,
                });

                setTimeout(() => {
                    interaction.channel.delete();
                }, 5000);
                if (!logs) return console.log("Canal Logs não configurado");
            }
                const cleanUsername = interaction.user.username
                    .toLowerCase()
                    .replace(/[\s._]/g, "");
            const channel = interaction.guild.channels.cache.find(
                (c) => c.name === `📁・ticket-${cleanUsername}`,
            );
            const canalTranscript = interaction.channel // Canal que será feito o transcript

            const attachment = await transcript.createTranscript(canalTranscript,
                {
                    limit: -1, // Quantidade máxima de mensagens a serem buscadas. `-1` busca recursivamente.
                    returnType: 'attachment', // Opções válidas: 'buffer' | 'string' | 'attachment' Padrão: 'attachment' OU use o enum ExportReturnType
                    filename: `${canalTranscript.name}.html`, // Válido apenas com returnType é 'attachment'. Nome do anexo.
                    saveImages: true, // Baixe todas as imagens e inclua os dados da imagem no HTML (permite a visualização da imagem mesmo depois de deletada) (! VAI AUMENTAR O TAMANHO DO ARQUIVO!)
                    footerText: 'Foram exportadas {number} mensagen{s}!', // Altere o texto no rodapé, não se esqueça de colocar {number} para mostrar quantas mensagens foram exportadas e {s} para plural
                    poweredBy: true // Se deve incluir o rodapé "Powered by discord-html-transcripts"
                })

            logs.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(`🚨 | Sistema de Ticket-LOGS`)
                        .setColor("#2b2d30")
                        .addFields(
                            {
                                name: `📞 | Ticket Aberto Por:`,
                                value: `${user}`,
                                inline: true,
                            },
                            {
                                name: `⚒️ | Ticket Finalizado Por:`,
                                value: `${interaction.user}`,
                                inline: true,
                            },
                            {
                                name: `📝 | Motivo do Ticket:`,
                                value: `\`${motivo}\``,
                                inline: true,
                            },
                            {
                                name: "⏰ | Data / Horário",
                                value: `<t:${Math.round(new Date().getTime() / 1000)}:f> (<t:${Math.round(new Date().getTime() / 1000)}:R>)`,
                                inline: true,
                            },
                        ),
                ],
                files: [attachment],
                components: [],
            });
            const lags = require("../json/logs.json");

            const idDoUsuario = user.id;
            const newUserLog = {
                dono_ticket: idDoUsuario,
                fechou_ticket: interaction.user.id,
                assumido: assumiu1 ?? "Ninguem assumiu",
                motivo: motivo,
                codigo: codigo,
            };

            if (!lags[idDoUsuario]) {
                lags[idDoUsuario] = [newUserLog];
            } else {
                lags[idDoUsuario].push(newUserLog);
            }

            fs.writeFileSync(
                "json/logs.json",
                JSON.stringify(lags, null, 2),
                "utf-8",
            );

            user.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(
                            `${emoji.exclamacao} | SEU TICKET FOI FECHADO`,
                        )
                        .setColor("#2b2d30")
                        .setDescription(
                            `${emoji.pessoa} | **Ticket aberto Por:**\n${user}\n${emoji.errado} | **Ticket fechado por:**\n\`${interaction.user.username}\`\n**${emoji.calendario} | Data & Hora:**\n<t:${Math.round(new Date().getTime() / 1000)}:f> (<t:${Math.round(new Date().getTime() / 1000)}:R>)`,
                        ),
                ],
            });
        }

        if (interaction.customId === "ticket_assumir") {
            const tickets = await db.get(`ticket_${interaction.channel.id}`);
            const usuario = tickets.usuario;
            const user = interaction.guild.members.cache.get(usuario);
            const motivo = tickets.motivo;
            const codigo = tickets.codigo;

            const user1 = interaction.guild.members.cache.get(
                interaction.user.id,
            );

            db.set(`ticket_${interaction.channel.id}`, {
                usuario: usuario,
                motivo: motivo,
                codigo: codigo,
                staff: interaction.user.id,
            });
            const staffUserId = interaction.user.id;

            const assumedData = readAssumedData();

            if (!assumedData[staffUserId]) {
                assumedData[staffUserId] = 0;
            }

            assumedData[staffUserId]++;

            saveAssumedData(assumedData);
            fs.writeFileSync(
                "json/assumidos.json",
                JSON.stringify(assumedData, null, 2),
            );

            function substituirVariaveis(texto, user, motivo, codigo) {
                return texto
                    .replace("{user}", user)
                    .replace("{motivo}", motivo)
                    .replace("{assumido}", `${interaction.user}`)
                    .replace("{codigo}", codigo);
            }

            const embeds = new Discord.EmbedBuilder().setDescription(
                substituirVariaveis(
                    config.config_dentro.texto,
                    user,
                    motivo,
                    codigo,
                ),
            );

            if (ticket.config_dentro.thumbnail) {
                embeds.setImage(`${ticket.config_dentro.thumbnail}`);
            }

            if (
                !interaction.member.permissions.has(
                    Discord.PermissionFlagsBits.ManageMessages,
                )
            ) {
                interaction.reply({
                    content: `${emoji.errado} | Você não possui permissão para utilizar esta opção.`,
                    flags: 64,
                });
            } else {
                user.send({
                    embeds: [
                        new Discord.EmbedBuilder().setDescription(
                            `O seu **TICKET** foi assumido pelo usuário ${interaction.user}, clique no **BOTÃO** para ir ao **TICKET**`,
                        ),
                    ],
                    components: [
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                                .setLabel("Ir para o Ticket")
                                .setStyle(5)
                                .setURL(`${interaction.channel.url}`),
                        ),
                    ],
                });

                interaction.update({
                    embeds: [embeds],
                    components: [
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId("sair_ticket")
                                .setLabel("Sair do Canal")
                                .setStyle(1),
                            new Discord.ButtonBuilder()
                                .setCustomId("painel_staff")
                                .setLabel("Painel Staff")
                                .setStyle(2),
                            new Discord.ButtonBuilder()
                                .setCustomId("painel_member")
                                .setLabel("Painel Membro")
                                .setStyle(2),
                            new Discord.ButtonBuilder()
                                .setCustomId("ticket_assumir")
                                .setLabel("Assumir Ticket")
                                .setStyle(2)
                                .setDisabled(true),
                            new Discord.ButtonBuilder()
                                .setCustomId("finalization_ticket")
                                .setLabel("Finalizar Ticket")
                                .setStyle(Discord.ButtonStyle.Danger),
                        ),
                    ],
                });
            }
        }

        if (interaction.customId === "painel_member") {
            interaction.reply({
                embeds: [],
                flags: 64,
                components: [
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId("painel_membro")
                            .setPlaceholder("Escolha alguma opção")
                            .addOptions(
                                {
                                    label: "Chamar Staff",
                                    description:
                                        "Chame algum Staff para o ticket.",
                                    emoji: "<:status2:1199066098587418635>",
                                    value: "Cham_Staff",
                                },
                                {
                                    label: "Criar uma Call",
                                    description:
                                        "Crie uma Call se for necessário.",
                                    emoji: "<:mais:1198681268729159833>",
                                    value: "call_create",
                                },
                                {
                                    label: "Deletar sua Call",
                                    description:
                                        "Delete a sua Call que foi criada.",
                                    emoji: "<:menos:1198681297271402618>",
                                    value: "del_call",
                                },
                            ),
                    ),
                ],
            });
        }

        if (
            interaction.isStringSelectMenu() &&
            interaction.customId === "painel_membro"
        ) {
            const options = interaction.values[0];

            if (options === "Cham_Staff") {
                const tickets = await db.get(
                    `ticket_${interaction.channel.id}`,
                );
                const usuario = tickets.usuario;
                const user = interaction.guild.members.cache.get(usuario);
                const staff = interaction.guild.members.cache.get(
                    tickets.staff,
                );

                if (interaction.user.id !== user.id) {
                    interaction.reply({
                        content: `${emoji.errado} | Só o usuario: ${user}, pode usar esta função`,
                    });
                }
                if (staff) {
                    staff.send({
                        content: `⏰ | O Usuário: ${interaction.user}, está lhe esperando.`,
                        components: [
                            new Discord.ActionRowBuilder().addComponents(
                                new Discord.ButtonBuilder()
                                    .setURL(interaction.channel.url)
                                    .setLabel("Ir para o Ticket")
                                    .setStyle(5),
                            ),
                        ],
                    });

                    interaction.reply({
                        content: `${emoji.certo} | Enviado com sucesso`,
                        flags: 64,
                    });
                } else {
                    interaction.reply({
                        content: `${emoji.errado} | Ninguém assumiu seu ticket ainda!`,
                        flags: 64,
                    });
                }
            }

            if (options === "call_create") {
                const channel_find =
                    await interaction.guild.channels.cache.find(
                        (c) =>
                            c.name ===
                            `📞-${interaction.user.username.toLowerCase().replace(/ /g, "-")}`,
                    );

                if (channel_find)
                    return interaction.update({
                        embeds: [
                            new Discord.EmbedBuilder().setDescription(
                                `${emoji.errado} | Você já possui uma call aberta em ${channel_find}`,
                            ),
                        ],
                        components: [
                            new Discord.ActionRowBuilder().addComponents(
                                new Discord.ButtonBuilder()
                                    .setStyle(5)
                                    .setLabel("Entrar na call")
                                    .setURL(channel_find.url),
                            ),
                        ],
                        flags: 64,
                    });

                const permissionOverwrites = [
                    {
                        id: interaction.guild.id,
                        deny: ["ViewChannel"],
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            "ViewChannel",
                            "SendMessages",
                            "AttachFiles",
                            "AddReactions",
                        ],
                    },
                    {
                        id: ticket.config_principais.cargo_staff,
                        allow: [
                            "ViewChannel",
                            "SendMessages",
                            "AttachFiles",
                            "AddReactions",
                        ],
                    },
                ];

                const channel = await interaction.guild.channels.create({
                    name: `call-${interaction.user.username
                        .toLowerCase()
                        .replace(/ /g, "-")}`,
                    type: 2,
                    parent: interaction.channel.parent,
                    permissionOverwrites: permissionOverwrites,
                });

                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder().setDescription(
                            `${emoji.certo} | Call criada com sucesso em ${channel}`,
                        ),
                    ],
                    components: [
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                                .setStyle(5)
                                .setLabel("Entrar na call")
                                .setURL(channel.url),
                        ),
                    ],
                    flags: 64,
                });
            }

            if (options === "del_call") {
                const channel_find =
                    await interaction.guild.channels.cache.find(
                        (c) =>
                            c.name ===
                            `call-${interaction.user.username.toLowerCase().replace(/ /g, "-")}`,
                    );

                if (!channel_find)
                    return interaction.update({
                        embeds: [
                            new Discord.EmbedBuilder().setDescription(
                                `${emoji.errado} | Você não nenhuma possui uma call aberta!`,
                            ),
                        ],
                        components: [],
                        flags: 64,
                    });

                await channel_find.delete();

                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder().setDescription(
                            `${emoji.certo} | Call deletada com sucesso!`,
                        ),
                    ],
                    components: [],
                    flags: 64,
                });
            }
        }

        if (interaction.customId === "sair_ticket") {
            const tickets = await db.get(`ticket_${interaction.channel.id}`);
            const user = tickets.usuario;
            if (user !== interaction.user.id) {
                interaction.reply({
                    content: `${emoji.errado} | Só quem pode sair é o usuario <@${user}>`,
                    flags: 64,
                });
                return;
            }

            interaction.channel.edit({
                name: `closed-${interaction.user.username}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["ViewChannel"],
                    },
                    {
                        id: interaction.user.id,
                        deny: [
                            "ViewChannel",
                            "SendMessages",
                            "AttachFiles",
                            "AddReactions",
                        ],
                    },
                    {
                        id: ticket.config_principais.cargo_staff,
                        allow: [
                            "ViewChannel",
                            "SendMessages",
                            "AttachFiles",
                            "AddReactions",
                        ],
                    },
                ],
            });

            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder().setDescription(
                        "O Dono do ticket saiu, clique no botão abaixo para finalizar o ticket",
                    ),
                ],
                components: [
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("finalization_ticket")
                            .setEmoji("<:trash:1150578055169974363>")
                            .setLabel("Finalizar Ticket")
                            .setStyle(Discord.ButtonStyle.Danger),
                    ),
                ],
            });
        }


        
    },
};
