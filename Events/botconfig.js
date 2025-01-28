const Discord = require("discord.js");
const emoji = require("../json/emojis.json");
const vips = require("../json/vips.json");
const perms = require("../json/perms.json");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const config = require("../config.json");
const fs = require("fs");
const path = require("path");
let ticket = require("../json/config.ticket.json");

module.exports = {
  name: "painel",
  async execute(interaction) {
    if (interaction.customId) {
      const { guild, user, channel } = interaction;
      if (interaction.isStringSelectMenu()) {
        // CONFIGURAR BOT
        if (interaction.values[0] === "bot") {
          interaction.update({
            embeds: [
              new Discord.EmbedBuilder()
                .setTitle("Configuração do bot")
                .setDescription(
                  `## **Painel de Configuração**\n\nOlá, ${user}! Bem-vindo ao painel de configuração do bot.\n\n **Opções de Personalização**\n- **Nome do Bot:** Altere o nome do bot.\n- **Avatar:** Troque a imagem do avatar.\n- **Cor Padrão:** Escolha uma nova cor para os embeds.`,
                )

                .setColor(config.color),
            ],
            components: [
              new Discord.ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("avatar_bot")
                  .setLabel("Alterar Avatar Bot")
                  .setStyle(ButtonStyle.Primary),
              ),
              new Discord.ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("nome_bot")
                  .setLabel("Alterar Nome Bot")
                  .setStyle(ButtonStyle.Primary),
              ),
              new Discord.ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("cor_padrao")
                  .setLabel("Alterar Cor Padrão")
                  .setStyle(ButtonStyle.Primary),
              ),
              new Discord.ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("voltar3")
                  .setLabel("Voltar")
                  .setStyle(ButtonStyle.Secondary),
              ),
            ],
          });
        }
      }
      // ALTERAR AVATAR BOT
      if (interaction.customId === "avatar_bot") {
        // Cria o modal para inserir o link
        const modal = new ModalBuilder()
          .setCustomId("set_bot_avatar")
          .setTitle("Alterar Avatar do Bot");

        const linkInput = new TextInputBuilder()
          .setCustomId("image_link")
          .setLabel("Insira o link direto da imagem:")
          .setPlaceholder("https://example.com/imagem.png")
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

        const row = new ActionRowBuilder().addComponents(linkInput);

        modal.addComponents(row);

        // Exibe o modal
        await interaction.showModal(modal);
      }

      // Tratamento após o envio do modal
      if (
        interaction.isModalSubmit() &&
        interaction.customId === "set_bot_avatar"
      ) {
        const imageUrl = interaction.fields.getTextInputValue("image_link");

        try {
          await interaction.client.user.setAvatar(imageUrl);
          await interaction.reply({
            content: `${emoji.certo} | Avatar do bot atualizado com sucesso!`,
            flags: 64,
          });
        } catch (error) {
          console.error("Erro ao definir o avatar:", error);
          await interaction.reply({
            content: `${emoji.errado} | Ocorreu um erro. Certifique-se de que o link é válido.`,
            flags: 64,
          });
        }
      }
      // ALTERAR NOME BOT
      if (interaction.customId === "nome_bot") {
        // Cria o modal para inserir o novo nome
        const modal = new ModalBuilder()
          .setCustomId("set_bot_name")
          .setTitle("Alterar Nome do Bot");

        const nameInput = new TextInputBuilder()
          .setCustomId("bot_name")
          .setLabel("Insira o novo nome do bot:")
          .setPlaceholder("Digite aqui")
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

        const row = new ActionRowBuilder().addComponents(nameInput);

        modal.addComponents(row);

        // Exibe o modal
        await interaction.showModal(modal);
      }

      // Tratamento após o envio do modal
      if (
        interaction.isModalSubmit() &&
        interaction.customId === "set_bot_name"
      ) {
        const newName = interaction.fields.getTextInputValue("bot_name");

        try {
          // Atualiza o nome do bot
          await interaction.client.user.setUsername(newName);

          await interaction.reply({
            content: `${emoji.certo} | Nome do bot atualizado com sucesso!`,
            flags: 64,
          });
        } catch (error) {
          console.error("Erro ao definir o nome:", error);
          await interaction.reply({
            content: `${emoji.errado} | Ocorreu um erro ao atualizar o nome. Tente novamente mais tarde.`,
            flags: 64,
          });
        }
      }
      // ALTERAR COR PADRÃO
      if (interaction.customId === "cor_padrao") {
        // Cria o modal para inserir a cor em hexadecimal
        const modal = new ModalBuilder()
          .setCustomId("set_bot_color")
          .setTitle("Alterar Cor do Bot");

        const colorInput = new TextInputBuilder()
          .setCustomId("bot_color")
          .setLabel("Insira uma cor em hexadecimal (ex: #ff5733):")
          .setPlaceholder("#ff5733")
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

        const row = new ActionRowBuilder().addComponents(colorInput);

        modal.addComponents(row);

        // Exibe o modal
        await interaction.showModal(modal);
      }

      // Tratamento após o envio do modal
      if (
        interaction.isModalSubmit() &&
        interaction.customId === "set_bot_color"
      ) {
        const colorHex = interaction.fields.getTextInputValue("bot_color");

        // Validação simples de cor hexadecimal
        if (!/^#([0-9A-Fa-f]{6})$/.test(colorHex)) {
          return await interaction.reply({
            content:
              "Cor inválida! Insira um valor hexadecimal válido, como #ff5733.",
            flags: 64,
          });
        }

        try {
          // Supondo que você tenha um objeto config onde a cor deve ser armazenada
          config.color = colorHex;
          fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
          await interaction.reply({
            content: `${emoji.certo} | Cor do bot configurada com sucesso para ${colorHex}!`,
            flags: 64,
          });
        } catch (error) {
          console.error("Erro ao definir a cor:", error);
          await interaction.reply({
            content: `${emoji.errado} | Ocorreu um erro ao salvar a cor. Tente novamente.`,
            flags: 64,
          });
        }
      }

      // SISTEMA DE VIP
      if (interaction.isStringSelectMenu()) {
        if (interaction.values[0] === "vips") {
          interaction.update({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `🎉 **Olá, ${interaction.user}!**\n\n` +
                    `👋  | Seja muito bem-vindo ao **Painel de Gerenciamento de VIPs**.\n\n` +
                    `**Aqui você pode:**\n` +
                    `- ➕ Adicionar ou remover membros ao VIP;\n` +
                    `- 🎨 Configurar cargos personalizados para cores;\n` +
                    `- 📜 Visualizar a lista de membros que tenha VIP;\n` +
                    `🌟 **Explore as opções abaixo e gerencie os VIPs do seu jeito!**`,
                )
                .setColor("Green"),
            ],
            components: [
              new Discord.ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("membros_vips")
                  .setLabel("Gerenciar Membros Vip")
                  .setStyle(ButtonStyle.Primary),
              ),
              new Discord.ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("cargo_vip")
                  .setLabel("Alterar Cargo Vip")
                  .setStyle(ButtonStyle.Success),
              ),
              new Discord.ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("cores_vip")
                  .setLabel("Alterar Cores Vip")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
              ),
              new Discord.ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("voltar3")
                  .setLabel("Voltar")
                  .setStyle(ButtonStyle.Secondary),
              ),
            ],
            flags: 64,
          });
        }
      }

      // INTERAÇÃO GERENCIAR MEMBROS DE VIPS
      if (interaction.customId === "membros_vips") {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("Selecione abaixo qual ação deseja realizar.")
              .setColor("Green"),
          ],
          components: [
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("addvip")
                .setLabel("Adicionar Membro ao Vip")
                .setStyle(ButtonStyle.Success),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("remvip")
                .setLabel("Remover Membro do Vip")
                .setStyle(ButtonStyle.Danger),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("listavip")
                .setLabel("Ver Lista de Vips")
                .setStyle(ButtonStyle.Primary),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("voltar43")
                .setLabel("Voltar")
                .setStyle(ButtonStyle.Secondary),
            ),
          ],
          flags: 64,
        });
      }

      if (interaction.customId === "addvip") {
        const timeSelectMenu = new Discord.StringSelectMenuBuilder()
          .setCustomId("select_vip_time")
          .setPlaceholder("Selecione a duração do VIP")
          .addOptions(
            { label: "1 Mês", value: "1" },
            { label: "3 Meses", value: "3" },
            { label: "6 Meses", value: "6" },
          );

        interaction.update({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "Escolha por quanto tempo você quer adicionar o VIP.",
              )
              .setColor(config.color),
          ],
          components: [new ActionRowBuilder().addComponents(timeSelectMenu)],
          flags: 64,
        });
      }

      if (interaction.customId === "select_vip_time") {
        const vipDuration = interaction.values[0];

        // Gera a lista de membros em partes menores se necessário
        const members = interaction.guild.members.cache.map((member) => ({
          label: member.user.tag,
          value: member.id,
        }));

        const memberOptions = members.slice(0, 25); // Discord permite no máximo 25 opções por menu
        const row = new Discord.StringSelectMenuBuilder()
          .setCustomId("select_member")
          .setPlaceholder("Selecione um membro")
          .addOptions(memberOptions);

        interaction.update({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `Você selecionou VIP por ${vipDuration} mês(es). Agora, selecione um membro para adicionar ao VIP.`,
              )
              .setColor(config.color),
          ],
          components: [new ActionRowBuilder().addComponents(row)],
          flags: 64,
        });

        interaction.user.vipDuration = vipDuration;
      }

      if (interaction.customId === "select_member") {
        const memberId = interaction.values[0];
        const member = interaction.guild.members.cache.get(memberId);

        if (!member) {
          return interaction.reply({
            content: "Membro não encontrado.",
            flags: 64,
          });
        }

        const vipRole = interaction.guild.roles.cache.get(config.cargo_vip);
        if (!vipRole) {
          return interaction.reply({
            content: "Cargo VIP não encontrado.",
            flags: 64,
          });
        }

        const vipDuration = interaction.user.vipDuration;
        const expirationDate = new Date();
        expirationDate.setMonth(
          expirationDate.getMonth() + parseInt(vipDuration),
        );

        try {
          await member.roles.add(vipRole);

          const existingVipIndex = vips.vips.findIndex(
            (vip) => vip.id === memberId,
          );
          if (existingVipIndex === -1) {
            vips.vips.push({
              id: memberId,
              duration: vipDuration,
              timestamp: expirationDate.toISOString(),
            });
          } else {
            vips.vips[existingVipIndex].duration = vipDuration;
            vips.vips[existingVipIndex].timestamp =
              expirationDate.toISOString();
          }

          fs.writeFileSync("./json/vips.json", JSON.stringify(vips, null, 2));
          interaction.reply({
            content: `${member.user.tag} agora tem o cargo VIP por ${vipDuration} mês(es)!`,
            flags: 64,
          });
        } catch (error) {
          console.error(error);
          interaction.reply({
            content: "Houve um erro ao adicionar o cargo VIP.",
            flags: 64,
          });
        }
      }

      if (interaction.customId === "remvip") {
        const members = interaction.guild.members.cache.map((member) => ({
          label: member.user.tag,
          value: member.id,
        }));

        const row = new Discord.StringSelectMenuBuilder()
          .setCustomId("select_member_rem")
          .setPlaceholder("Selecione um membro para remover o VIP")
          .addOptions(members);

        interaction.update({
          embeds: [
            new EmbedBuilder()
              .setDescription("Selecione um membro para remover o VIP.")
              .setColor(config.color),
          ],
          components: [new ActionRowBuilder().addComponents(row)],
          flags: 64,
        });
      }

      if (interaction.customId === "select_member_rem") {
        const memberId = interaction.values[0];
        const member = interaction.guild.members.cache.get(memberId);

        if (!member) {
          return interaction.reply({
            content: "Membro não encontrado.",
            flags: 64,
          });
        }

        const vipRole = interaction.guild.roles.cache.get(config.cargo_vip);
        if (!vipRole) {
          return interaction.reply({
            content: "Cargo VIP não encontrado.",
            flags: 64,
          });
        }

        try {
          await member.roles.remove(vipRole);

          const vipIndex = vips.vips.findIndex((vip) => vip.id === memberId);
          if (vipIndex > -1) {
            vips.vips.splice(vipIndex, 1);
            fs.writeFileSync("./json/vips.json", JSON.stringify(vips, null, 2));
          }

          interaction.reply({
            content: `${member.user.tag} teve o cargo VIP removido.`,
            flags: 64,
          });
        } catch (error) {
          console.error(error);
          interaction.reply({
            content: "Houve um erro ao remover o cargo VIP.",
            flags: 64,
          });
        }
      }

      if (interaction.customId === "listavip") {
        const lista_vip = vips.vips
          .map((vip) => `\n> ID: ${vip.id} | <@${vip.id}>`)
          .join("");

        interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("Lista de VIPs")
              .setDescription(`${lista_vip || "Nenhum VIP encontrado."}`)
              .setColor(config.color),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Voltar")
                .setCustomId("voltarvip1")
                .setStyle(ButtonStyle.Secondary),
            ),
          ],
          flags: 64,
        });
      }

      // INTERAÇÃO VOLTAR GERENCIAR SISTEMA VIP
      if (interaction.customId === "voltar43") {
        interaction.update({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `🎉 **Olá, ${interaction.user}!**\n\n` +
                  `👋  | Seja muito bem-vindo ao **Painel de Gerenciamento de VIPs**.\n\n` +
                  `**Aqui você pode:**\n` +
                  `- ➕ Adicionar ou remover membros ao VIP;\n` +
                  `- 🎨 Configurar cargos personalizados para cores;\n` +
                  `- 📜 Visualizar a lista de membros que tenha VIP;\n` +
                  `🌟 **Explore as opções abaixo e gerencie os VIPs do seu jeito!**`,
              )
              .setColor("Green"),
          ],
          components: [
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("membros_vips")
                .setLabel("Gerenciar Membros Vip")
                .setStyle(ButtonStyle.Primary),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("cargo_vip")
                .setLabel("Alterar Cargo Vip")
                .setStyle(ButtonStyle.Success),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("cores_vip")
                .setLabel("Alterar Cores Vip")
                .setStyle(ButtonStyle.Success)
                .setDisabled(true),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("voltar3")
                .setLabel("Voltar")
                .setStyle(ButtonStyle.Secondary),
            ),
          ],
          flags: 64,
        });
      }

      // ALTERAR CARGO DE VIP
      if (interaction.customId === "cargo_vip") {
        // Gera a lista de membros em partes menores se necessário
        const cargos1 = interaction.guild.roles.cache.map((role) => ({
          label: role.name,
          value: role.id,
        }));

        const roleOptions = cargos1.slice(0, 25); // Discord permite no máximo 25 opções por menu
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("Selecione no menu abaixo o cargo de vips.")
              .setColor(config.color),
          ],
          components: [
            new Discord.ActionRowBuilder().addComponents(
              new Discord.StringSelectMenuBuilder()
                .setCustomId("cargo-vip")
                .setPlaceholder("Selecione o cargo de vip")
                .addOptions(cargos1),
            ),
          ],
          flags: 64,
        });
      }
      // INTERAÇÃO MENU CARGOSTAFF
      if (interaction.customId === "cargo-vip") {
        const cargosId1 = interaction.values[0];
        // Atualizando a variável e o arquivo JSON
        config.cargo_vip = cargosId1;

        fs.writeFileSync(
          path.join(__dirname, "../../config.json"), // Caminho absoluto para evitar erros
          JSON.stringify(config.cargo_vip, null, 2),
        );

        interaction.reply({
          content: `O cargo de vips foi alterado para <@&${cargosId1}>.`,
          flags: 64,
        });
      }

      // INTERAÇÃO VOLTAR PAINEL DE VIP
      if (interaction.customId === "voltarvip1") {
        interaction.update({
          embeds: [
            new EmbedBuilder()
              .setDescription("Selecione abaixo qual ação deseja realizar.")
              .setColor("Green"),
          ],
          components: [
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("addvip")
                .setLabel("Adicionar Membro ao Vip")
                .setStyle(ButtonStyle.Success),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("remvip")
                .setLabel("Remover Membro do Vip")
                .setStyle(ButtonStyle.Danger),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("listavip")
                .setLabel("Ver Lista de Vips")
                .setStyle(ButtonStyle.Primary),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("voltar43")
                .setLabel("Voltar")
                .setStyle(ButtonStyle.Secondary),
            ),
          ],
          flags: 64,
        });
      }

      // GERENCIAR TICKETS
      if (interaction.isStringSelectMenu()) {
        if (interaction.values[0] === "sistema") {
          interaction.update({
            embeds: [
              new EmbedBuilder()
                .setTitle("Gerenciar Sistema de Tickets")
                .setDescription(
                  `🎉 **Olá, ${interaction.user}!**\n\n` +
                    `👋  | Seja muito bem-vindo ao **Painel de Gerenciamento de Tickets**.\n\n` +
                    `**Aqui você pode:**\n` +
                    `- ✏️ Personalizar o painel do seu ticket;\n` +
                    `- 📌 Configurar canais e categorias;\n` +
                    `- ✅ E muito mais...\n\n` +
                    `🌟 **Explore as opções abaixo e configure tudo do seu jeito!**`,
                )

                .setColor(config.color),
            ],
            components: [
              new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                  .setCustomId("tickets1")
                  .setLabel("Configurar os Canais")
                  .setStyle(ButtonStyle.Primary),
              ),
              new Discord.ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("personalizar")
                  .setLabel("Personalizar o Sistema de Tickets")
                  .setStyle(ButtonStyle.Primary),
              ),
              new Discord.ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("voltar3")
                  .setLabel("Voltar")
                  .setStyle(ButtonStyle.Secondary),
              ),
            ],
            flags: 64,
          });
        }
      }
      if (interaction.customId === "tickets1") {
        const cargo = guild.roles.cache.get(
          ticket.config_principais.cargo_staff,
        );
        const canal_logs = guild.channels.cache.get(
          ticket.config_principais.canal_logs,
        );
        const categoria_tickets = guild.channels.cache.get(
          ticket.config_principais.categoria_ticket,
        );

        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `> **🎯  Cargo de Staff:** ${cargo}\n` +
                  `> **📝  Canal de Logs:** ${canal_logs}\n` +
                  `> **📂  Categoria de Tickets:** ${categoria_tickets}`,
              )
              .setColor(config.color),
          ],
          components: [
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("cargo_staff")
                .setLabel("Alterar Cargo de Staff")
                .setStyle(ButtonStyle.Primary),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("canal_logs")
                .setLabel("Alterar Canal de Logs")
                .setStyle(ButtonStyle.Primary),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("categoria_tickets")
                .setLabel("Alterar Categoria de Tickets")

                .setStyle(ButtonStyle.Primary),
            ),
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("voltar1002")
                .setLabel("Voltar")
                .setStyle(ButtonStyle.Secondary),
            ),
          ],
          flags: 64,
        });
      }

      // ALTERAR CARGO DE STAFF
      if (interaction.customId === "cargo_staff") {
        // Gera a lista de membros em partes menores se necessário
        const cargos = interaction.guild.roles.cache.map((role) => ({
          label: role.name,
          value: role.id,
        }));

        const roleOptions = cargos.slice(0, 25); // Discord permite no máximo 25 opções por menu
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("Selecione no menu abaixo o cargo de staff.")
              .setColor("Green"),
          ],
          components: [
            new Discord.ActionRowBuilder().addComponents(
              new Discord.StringSelectMenuBuilder()
                .setCustomId("cargo-staff")
                .setPlaceholder("Selecione o cargo de staff")
                .addOptions(cargos),
            ),
          ],
          flags: 64,
        });
      }
      // INTERAÇÃO MENU CARGOSTAFF
      if (interaction.customId === "cargo-staff") {
        const cargosId = interaction.values[0];
        // Atualizando a variável e o arquivo JSON
        ticket.config_principais.cargo_staff = cargosId;

        fs.writeFileSync(
          path.join(__dirname, "../json/config.ticket.json"), // Caminho absoluto para evitar erros
          JSON.stringify(ticket, null, 2),
        );

        interaction.reply({
          content: `O cargo de staff foi alterado para <@&${cargosId}>.`,
          flags: 64,
        });
      }

      // ALTERAR CANAL DE LOGS
      if (interaction.customId === "canal_logs") {
        // Gera a lista de canais em partes menores se necessário
        const canais = interaction.guild.channels.cache.map((channel) => ({
          label: channel.name,
          value: channel.id,
        }));

        const channelOptions = canais.slice(0, 25); // Discord permite no máximo 25 opções por menu

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("Selecione abaixo o canal de logs de tickets.")
              .setColor("Green"),
          ],
          components: [
            new Discord.ActionRowBuilder().addComponents(
              new Discord.StringSelectMenuBuilder()
                .setCustomId("canal-logs")
                .setPlaceholder("Selecione o canal de logs")
                .addOptions(canais),
            ),
          ],
          flags: 64,
        });
      }
      if (interaction.customId === "canal-logs") {
        const canaisId = interaction.values[0];
        // Atualizando a variável e o arquivo JSON
        ticket.config_principais.canal_logs = canaisId;

        fs.writeFileSync(
          path.join(__dirname, "../json/config.ticket.json"), // Caminho absoluto para evitar erros
          JSON.stringify(ticket, null, 2),
        );

        interaction.reply({
          content: `O canal de Logs foi alterado para <#${canaisId}>.`,
          flags: 64,
        });
      }

      // ALTERAR CATEGORIA DE TICKETS
      if (interaction.customId === "categoria_tickets") {
        const categorias = interaction.guild.channels.cache
          .filter(
            (channel) => channel.type === Discord.ChannelType.GuildCategory,
          ) // Filtra categorias
          .map((category) => ({
            label: category.name, // Nome da categoria para exibir
            value: category.id, // ID da categoria para identificação
          }));

        const categoryOptions = categorias.slice(0, 25); // Discord permite no máximo 25 opções por menu
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("Selecione abaixo a categoria de tickets.")
              .setColor("Green"),
          ],
          components: [
            new Discord.ActionRowBuilder().addComponents(
              new Discord.StringSelectMenuBuilder()
                .setCustomId("categoria-ticket")
                .setPlaceholder("Selecione a categoria de ticket")
                .addOptions(categorias),
            ),
          ],
          flags: 64,
        });
      }
      if (interaction.customId === "categoria-ticket") {
        const categoriaId = interaction.values[0];
        // Atualizando a variável e o arquivo JSON
        ticket.config_principais.categoria_ticket = categoriaId;

        fs.writeFileSync(
          path.join(__dirname, "../json/config.ticket.json"), // Caminho absoluto para evitar erros
          JSON.stringify(ticket, null, 2),
        );

        interaction.reply({
          content: `A categoria de Tickets foi alterada para <#${categoriaId}>.`,
          flags: 64,
        });
      }

      // VOLTAR
      if (interaction.customId === "voltar1002") {
        interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("Gerenciar Sistema de Tickets")
              .setDescription(
                `🎉 **Olá, ${interaction.user}!**\n\n` +
                  `👋  | Seja muito bem-vindo ao **Painel de Gerenciamento de Tickets**.\n\n` +
                  `**Aqui você pode:**\n` +
                  `- ✏️ Personalizar o painel do seu ticket;\n` +
                  `- 📌 Configurar canais e categorias;\n` +
                  `- ✅ E muito mais...\n\n` +
                  `🌟 **Explore as opções abaixo e configure tudo do seu jeito!**`,
              )
              .setColor(config.color),
          ],
          components: [
            new Discord.ActionRowBuilder().addComponents(
              new Discord.ButtonBuilder()
                .setCustomId("tickets")
                .setLabel("Configurar os Canais")
                .setStyle(ButtonStyle.Primary),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("personalizar")
                .setLabel("Personalizar o Sistema de Tickets")
                .setStyle(ButtonStyle.Primary),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("voltar3")
                .setLabel("Voltar")
                .setStyle(ButtonStyle.Secondary),
            ),
          ],
          flags: 64,
        });
      }

      // PERSONALIZAR BOT
      if (interaction.customId === "personalizar") {
        interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor(config.color)
              .setTitle("Personalizar Bot")
              .setDescription(
                `💡 **Personalização da Mensagem do Painel de Tickets**\n\n` +
                  `> Se deseja alterar a mensagem do painel de tickets, utilize as variáveis abaixo:\n\n` +
                  `🔹 **{user}**\n` +
                  `- 🧑‍💻 Menciona o usuário que abriu o ticket.\n\n` +
                  `🔹 **{codigo}**\n` +
                  `- 🔢 Exibe o código único do ticket.\n\n` +
                  `🔹 **{assumido}**\n` +
                  `- 👥 Indica quem assumiu o ticket.\n\n` +
                  `🔹 **{motivo}**\n` +
                  `- ✏️ Mostra o motivo pelo qual o ticket foi criado.`,
              ),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("alterar_painel")
                .setLabel("Alterar a Mensagem do Painel")
                .setStyle(ButtonStyle.Primary),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("alterar_banner")
                .setLabel("Alterar o Banner do Ticket")
                .setStyle(ButtonStyle.Primary),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("emojis")
                .setLabel("Alterar os Emojis do Bot")
                .setStyle(ButtonStyle.Primary),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("resetar")
                .setLabel("Resetar a Mensagem do Painel")
                .setStyle(ButtonStyle.Danger),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("voltar2")
                .setLabel("Voltar")
                .setStyle(ButtonStyle.Secondary),
            ),
          ],
          flags: 64,
        });
      }
      // ALTERAR BANNER DO TICKET
      if (interaction.customId === "alterar_banner") {
        // Cria o modal para inserir o link do banner
        const modal = new ModalBuilder()
          .setCustomId("alterar_banner_modal")
          .setTitle("Alterar Banner");

        const bannerInput = new TextInputBuilder()
          .setCustomId("banner_link")
          .setLabel("Insira o link do novo banner:")
          .setPlaceholder("https://exemplo.com/banner.jpg")
          .setRequired(true)
          .setStyle(TextInputStyle.Short); // Use o estilo Short para campo de uma linha

        const row = new ActionRowBuilder().addComponents(bannerInput);

        modal.addComponents(row);

        // Exibe o modal
        await interaction.showModal(modal);
      }

      // Tratamento após o envio do modal
      if (interaction.isModalSubmit() && interaction.customId === "alterar_banner_modal") {
        const bannerLink = interaction.fields.getTextInputValue("banner_link");

        try {
          // Atualiza o arquivo JSON com o novo link do banner
          ticket.config_dentro.banner = bannerLink;

          fs.writeFileSync(
            path.join(__dirname, "../json/config.ticket.json"), // Caminho absoluto
            JSON.stringify(ticket, null, 2) // Salva no arquivo JSON
          );

          await interaction.reply({
            content: `O banner foi alterado com sucesso para: ${bannerLink}`,
            flags: 64,
          });
        } catch (error) {
          console.error("Erro ao salvar o banner:", error);
          await interaction.reply({
            content: `Ocorreu um erro ao salvar o banner. Tente novamente.`,
            flags: 64,
          });
        }
      }
      // RESETAR PAINEL
      if (interaction.customId === "resetar") {
        ticket.config_dentro.texto =
          "👋 | Olá {user}, seja bem vindo(a) ao seu ticket!\n❗ | Evite marcações, aguarde até que um staff te atenda.\n👥 | Quem assumiu: {assumido}\n\n📝  | Assunto do Ticket: ``` {motivo}  ```";
        interaction.reply({
          content: `${emoji.certo} | A mensagem do painel foi resetada com sucesso!`,
          flags: 64,
        });

        fs.writeFileSync("json/config.ticket.json", JSON.stringify(ticket));
      }

      // ALTERAR EMOJIS DO BOT
      if (interaction.customId === "emojis") {
        const emojisList = Object.entries(emoji)
          .map(([name, value]) => `**${name}**: ${value}`)
          .join("\n");

        interaction.reply({
          content: ``,
          embeds: [
            new EmbedBuilder()
              .setTitle("Personalizar Emojis")
              .setDescription(
                `Aqui estão os emojis atuais do bot:\n${emojisList}\n\nPor favor, envie o emoji que você deseja alterar.`,
              )
              .setColor(config.color),
          ],
          flags: 64,
        });

        // Espera a resposta do usuário com o emoji a ser alterado
        const filter = (response) => response.author.id === interaction.user.id;
        const collected = await interaction.channel.awaitMessages({
          filter,
          max: 1,
          time: 60000,
          errors: ["time"],
        });

        const emojiToChange = collected.first().content;

        // Apaga a mensagem do usuário
        await collected.first().delete();

        // Verifica se o emoji enviado está na lista
        if (!emoji[emojiToChange]) {
          interaction.followUp({
            content:
              "Este emoji não está na lista! Tente novamente com um emoji válido.",
            flags: 64,
          });
          return;
        }

        // Solicita o novo emoji
        interaction.followUp({
          content: `Você escolheu o emoji **${emojiToChange}**. Agora, por favor, envie o novo emoji que deseja usar.`,
          flags: 64,
        });

        const newEmojiCollected = await interaction.channel.awaitMessages({
          filter,
          max: 1,
          time: 60000,
          errors: ["time"],
        });

        const newEmoji = newEmojiCollected.first().content;

        // Apaga a mensagem do usuário
        await newEmojiCollected.first().delete();

        // Atualiza o emoji no arquivo
        emoji[emojiToChange] = newEmoji;

        fs.writeFileSync("json/emojis.json", JSON.stringify(emoji, null, 2));

        interaction.followUp({
          content: `O emoji **${emojiToChange}** foi alterado com sucesso para **${newEmoji}**!`,
          flags: 64,
        });
      }

      // VOLTAR
      if (interaction.customId === "voltar2") {
        interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("Gerenciar Sistema de Tickets")
              .setDescription(
                `🎉 **Olá, ${interaction.user}!**\n\n` +
                  `👋  | Seja muito bem-vindo ao **Painel de Gerenciamento de Tickets**.\n\n` +
                  `**Aqui você pode:**\n` +
                  `- ✏️ Personalizar o painel do seu ticket;\n` +
                  `- 📌 Configurar canais e categorias;\n` +
                  `- ✅ E muito mais...\n\n` +
                  `🌟 **Explore as opções abaixo e configure tudo do seu jeito!**`,
              )
              .setColor(config.color),
          ],
          components: [
            new Discord.ActionRowBuilder().addComponents(
              new Discord.ButtonBuilder()
                .setCustomId("tickets1")
                .setLabel("Configurar os Canais")
                .setStyle(ButtonStyle.Primary),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("personalizar")
                .setLabel("Personalizar o Sistema de Tickets")
                .setStyle(ButtonStyle.Primary),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("voltar3")
                .setLabel("Voltar")
                .setStyle(ButtonStyle.Secondary),
            ),
          ],
          flags: 64,
        });
      }

      // GERENCIAR PERMISSÕES
      if (interaction.isStringSelectMenu()) {
        if (interaction.values[0] === "permissoes") {
          const lista_Usuarios = Object.keys(perms);

          // Formatar a lista de usuários para exibição
          const listaUsuarios = lista_Usuarios
            .map((userId) => `\n> 🆔 **ID:** ${userId} | 👤  <@${userId}>`)
            .join("");

          interaction.update({
            embeds: [
              new EmbedBuilder()
                .setTitle("**Gerenciar Permissões**")
                .setDescription(
                  `👥 | **Usuários com permissão no bot:**\n${listaUsuarios}\n` +
                    `👑 | **Dono do bot:** <@${config.owner}>`,
                )
                .setColor(config.color),
            ],
            components: [
              new Discord.ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setLabel("Adicionar Permissão")
                  .setCustomId("add_perm")
                  .setStyle(Discord.ButtonStyle.Success),
              ),
              new Discord.ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setLabel("Remover Permissão")
                  .setCustomId("rem_perm")
                  .setStyle(Discord.ButtonStyle.Danger),
              ),
              new Discord.ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setLabel("Transferir Proprietário")
                  .setCustomId("owner")
                  .setStyle(Discord.ButtonStyle.Primary),
              ),
              new Discord.ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setLabel("Voltar")
                  .setCustomId("voltar3")
                  .setStyle(Discord.ButtonStyle.Secondary),
              ),
            ],
            flags: 64,
          });
        }
      }
      if (interaction.customId === "add_perm") {
        // Criar um prompt para o usuário digitar o ID
        if (interaction.replied) return; // Impede que a interação seja respondida mais de uma vez
        await interaction.reply({
          content:
            "Por favor, forneça o ID da pessoa que você deseja adicionar.",
          flags: 64,
        });

        // Criar um coletor de mensagens para obter o ID do usuário
        const filter = (m) => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({
          filter,
          time: 30000,
          max: 1,
        });

        collector.on("collect", async (m) => {
          // Excluir a mensagem do usuário (para não ficar visível no chat)
          await m.delete();

          // Verificar se o ID fornecido é válido (um número válido de Discord)
          const userId = m.content.trim();
          if (!userId.match(/^\d+$/)) {
            return interaction.followUp({
              content: "Por favor, forneça um ID de usuário válido.",
              flags: 64,
            });
          }

          // Verifica se o ID já está presente no JSON
          if (perms[userId]) {
            return interaction.followUp({
              content: "Este ID já está registrado nas permissões.",
              flags: 64,
            });
          }

          // Adicionar o novo ID com valor `true` (indicando permissão)
          perms[userId] = true;

          // Salvar as alterações no arquivo perms.json
          fs.writeFileSync("./json/perms.json", JSON.stringify(perms, null, 2));

          // Confirmar que o ID foi adicionado
          await interaction.editReply({
            content: `O ID **${userId}** foi adicionado às permissões com sucesso!`,
            flags: 64, // Alterei para não ser efêmero, permitindo que todos vejam
          });
        });

        collector.on("end", (collected, reason) => {
          if (reason === "time") {
            interaction.followUp({
              content: "O tempo para fornecer um ID expirou.",
              flags: 64,
            });
          }
        });
      }

      // Lógica para o botão de remover permissão
      if (interaction.customId === "rem_perm") {
        // Criar um prompt para o usuário digitar o ID
        if (interaction.replied) return; // Impede que a interação seja respondida mais de uma vez
        await interaction.reply({
          content: "Por favor, forneça o ID da pessoa que você deseja remover.",
          flags: 64,
        });

        // Criar um coletor de mensagens para obter o ID do usuário
        const filter = (m) => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({
          filter,
          time: 30000,
          max: 1,
        });

        collector.on("collect", async (m) => {
          // Excluir a mensagem do usuário (para não ficar visível no chat)
          await m.delete();

          // Verificar se o ID fornecido é válido (um número válido de Discord)
          const userId = m.content.trim();
          if (!userId.match(/^\d+$/)) {
            return interaction.followUp({
              content: "Por favor, forneça um ID de usuário válido.",
              flags: 64,
            });
          }

          // Verificar se o ID está presente no JSON
          if (!perms[userId]) {
            return interaction.followUp({
              content: "Este ID não está registrado nas permissões.",
              flags: 64,
            });
          }

          // Remover o ID do arquivo perms.json
          delete perms[userId];

          // Salvar as alterações no arquivo perms.json
          fs.writeFileSync("./json/perms.json", JSON.stringify(perms, null, 2));

          await interaction.editReply({
            content: `O ID **${userId}** foi removido das permissões com sucesso!`,
            flags: 64, // Alterei para não ser efêmero, permitindo que todos vejam
          });
        });

        collector.on("end", (collected, reason) => {
          if (reason === "time") {
            interaction.followUp({
              content: "O tempo para fornecer um ID expirou.",
              flags: 64,
            });
          }
        });
      }

      // ALTERAR OWNER
      if (interaction.customId === "owner") {
        // Criar um prompt para o usuário digitar o ID
        if (interaction.replied) return; // Impede que a interação seja respondida mais de uma vez
        await interaction.reply({
          content: "Por favor, forneça o novo ID do owner.",
          flags: 64,
        });

        // Criar um coletor de mensagens para obter o ID do usuário
        const filter = (m) => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({
          filter,
          time: 30000,
          max: 1,
        });

        collector.on("collect", async (m) => {
          // Excluir a mensagem do usuário (para não ficar visível no chat)
          await m.delete();

          // Verificar se o ID fornecido é válido (um número válido de Discord)
          const newOwnerId = m.content.trim();
          if (!newOwnerId.match(/^\d+$/)) {
            return interaction.followUp({
              content: "Por favor, forneça um ID de usuário válido.",
              flags: 64,
            });
          }

          // Atualizar o config.owner com o novo ID
          config.owner = newOwnerId;

          // Salvar as alterações no arquivo config.json
          fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));

          // Confirmar a alteração do owner
          await interaction.editReply({
            content: `O novo owner foi alterado para: <@${newOwnerId}>`,
            flags: 64,
          });
        });

        collector.on("end", (collected, reason) => {
          if (reason === "time") {
            interaction.followUp({
              content: "O tempo para fornecer um ID expirou.",
              flags: 64,
            });
          }
        });
      }
      // VOLTAR3
      if (interaction.customId === "voltar3") {
        interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("🇫 - Painel do seu BOT")
              .setColor(config.color)
              .setDescription(
                `Bom dia senhor(a) ${interaction.user}, o que deseja fazer?`,
              )
              .addFields(
                {
                  name: "Versão do Bot",
                  value: "1.0.0",
                },
                {
                  name: "Ping",
                  value: `\`34 MS\``,
                },
              ),
          ],
          components: [
            new Discord.ActionRowBuilder().addComponents(
              new Discord.StringSelectMenuBuilder()
                .setCustomId("painel")
                .setPlaceholder("Selecione uma opção")
                .setOptions(
                  {
                    label: "Configurações do BOT",
                    value: "bot",
                    emoji: "<:manager:1333763886213632072>",
                  },
                  {
                    label: "Gerenciar Sistema de Tickets",
                    value: "sistema",
                    emoji: "<:emoji_3:1333521232934731887>",
                  },
                  {
                    label: "Gerenciar Sistema de Vips",
                    value: "vips",
                    emoji: "<:foguete:1333531675816235031>",
                  },
                  {
                    label: "Gerenciar Permissões",
                    value: "permissoes",
                    emoji: "<:membro:1333531578302861405>",
                  },
                ),
            ),
          ],
          flags: 64,
        });
      }
    }
  },
};
