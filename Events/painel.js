const Discord = require("discord.js");
const emoji = require("../json/emojis.json");
const perms = require("../json/perms.json");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder
} = require("discord.js");
const config = require("../config.js");
const fs = require("fs");
const path = require("path");
let ticket = require("../json/config.ticket.json");

module.exports = {
  name: "painel",
  async execute(interaction) {
    if (interaction.customId) {
      const { guild, user, channel } = interaction;
      
      // GERENCIAR VIPS
      
      if (interaction.customId === "vips") {
        interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("Sistema de VIPs")
              .setDescription(
                "Este sistema permite a personalização das cores e a gestão dos cargos VIP, oferecendo controle total sobre os privilégios e a aparência dos membros VIP, garantindo uma experiência exclusiva e adaptada ao servidor.",
              )
              .setColor("Green"),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Alterar Cargo de Vip")
                .setCustomId("cargo_vip")
                .setStyle(ButtonStyle.Primary),
            ),
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Alterar Cores de Vip")
                .setCustomId("cores_vip")
                .setStyle(ButtonStyle.Primary),
            ),
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Voltar")
                .setCustomId("voltar0")
                .setStyle(ButtonStyle.Secondary),
            ),
          ],
        });
      }

      if (interaction.customId === "cargo_vip") {
        const cargos = interaction.guild.roles.cache.map((role) => ({
          label: role.name,
          value: role.id,
          description: `ID do Cargo: ${role.id}`,
        }));

        // Cria o embed para a mensagem
        const luffy = new EmbedBuilder()
          .setDescription("Selecione um cargo para ser o cargo VIP.")
          .setColor("Green");

        // Cria o menu de seleção de cargos
        const selectRoleMenu = new StringSelectMenuBuilder()
          .setCustomId("cargo-vip")
          .setPlaceholder("Selecione o cargo de VIP")
          .addOptions(cargos);

        // Adiciona o menu em um ActionRow
        const row = new ActionRowBuilder().addComponents(selectRoleMenu);

        // Responde ao usuário
        interaction.reply({
          embeds: [luffy],
          components: [row],
          flags: 64, // Deixa a mensagem visível apenas para o autor
        });
      }
  // CARGO-VIP 
      if (interaction.customId === "cargo-vip") {

        const cargo_vip = interaction.guild.roles.cache.get(config.cargovip);
        config.cargovip = cargo_vip;
        try {
          fs.writeFileSync("./config.json", JSON.stringify(ticket, null, 2));
          interaction.reply({
            content: `O cargo VIP foi alterado com sucesso para <@&${cargo_vip.id}>.`,
            flags: 64
          });
        } catch (error) {
          console.error(error);
          interaction.reply({
            content: "Houve um erro ao adicionar o cargo VIP.",
            flags: 64
          });
        }
      }
      
      // GERENCIAR TICKETS
      if (interaction.customId === "sistema") {
        interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("Gerenciar Sistema de Tickets")
              .setDescription(
                `Olá ${interaction.user}. Seja bem-vindo ao painel de gerenciamento de tickets.\n-# Aqui você pode personalizar o painel do seu ticket, configurar canais e muito mais...`,
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
                .setCustomId("voltar0")
                .setLabel("Voltar")
                .setStyle(ButtonStyle.Secondary),
            ),
          ],
          flags: 64,
        });
      }
      if (interaction.customId === "tickets") {
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
                `**Cargo de Staff:** ${cargo}\n**Canal de Logs:** ${canal_logs}\n**Categoria de Tickets:** ${categoria_tickets}`,
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
                .setCustomId("voltar1")
                .setLabel("Voltar")
                .setStyle(ButtonStyle.Secondary),
            ),
          ],
          flags: 64,
        });
      }
      // VOLTAR
      if (interaction.customId === "voltar0") {
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
                  value: `\`32 MS\``,
                },
              ),
          ],
          components: [
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("sistema")
                .setLabel("Gerenciar Sistema de Ticket")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("⚙️"),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("permissoes")
                .setLabel("Gerenciar Permissões")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("🔑"),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("vips")
                .setLabel("Gerenciar Sistema de Vips")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("💎"),
            ),
          ],
          flags: 64,
        });
      }

      // ALTERAR CARGO DE STAFF
      if (interaction.customId === "cargo_staff") {
        interaction.reply({
          content: "Envie o ID do cargo de Staff:",
          flags: 64,
        });

        const collector = channel.createMessageCollector({
          filter: (msg) => msg.author.id === user.id,
          max: 1,
          time: 60000,
        });

        collector.on("collect", (msg) => {
          msg.delete();
          const cargoId = msg.content;

          // Atualizando a variável e o arquivo JSON
          ticket.config_principais.cargo_staff = cargoId;

          fs.writeFileSync(
            path.join(__dirname, "../json/config.ticket.json"), // Caminho absoluto para evitar erros
            JSON.stringify(ticket, null, 2),
          );

          interaction.editReply({
            content: `O cargo de staff foi alterado para <@&${cargoId}>.`,
            flags: 64,
          });
        });
      }

      // ALTERAR CANAL DE LOGS
      if (interaction.customId === "canal_logs") {
        interaction.reply({
          content: "Envie o ID do canal de Logs:",
          flags: 64,
        });

        const collector = channel.createMessageCollector({
          filter: (msg) => msg.author.id === user.id,
          max: 1,
          time: 60000,
        });

        collector.on("collect", (msg) => {
          msg.delete();
          const canalId = msg.content;

          // Atualizando a variável e o arquivo JSON
          ticket.config_principais.canal_logs = canalId;

          fs.writeFileSync(
            path.join(__dirname, "../json/config.ticket.json"), // Caminho absoluto para evitar erros
            JSON.stringify(ticket, null, 2),
          );

          interaction.editReply({
            content: `O canal de Logs foi alterado para <#${canalId}>.`,
            flags: 64,
          });
        });
      }

      // ALTERAR CATEGORIA DE TICKETS
      if (interaction.customId === "categoria_tickets") {
        interaction.reply({
          content: "Envie o ID da categoria de Tickets:",
          flags: 64,
        });

        const collector = channel.createMessageCollector({
          filter: (msg) => msg.author.id === user.id,
          max: 1,
          time: 60000,
        });

        collector.on("collect", (msg) => {
          msg.delete();
          const categoriaId = msg.content;

          // Atualizando a variável e o arquivo JSON
          ticket.config_principais.categoria_ticket = categoriaId;

          fs.writeFileSync(
            path.join(__dirname, "../json/config.ticket.json"), // Caminho absoluto para evitar erros
            JSON.stringify(ticket, null, 2),
          );

          interaction.editReply({
            content: `A categoria de Tickets foi alterada para <#${categoriaId}>.`,
            flags: 64,
          });
        });
      }

      // VOLTAR
      if (interaction.customId === "voltar1") {
        interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("Gerenciar Sistema de Tickets")
              .setDescription(
                `Olá ${interaction.user}. Seja bem-vindo ao painel de gerenciamento de tickets.\n-# Aqui você pode personalizar o painel do seu ticket, configurar canais e muito mais...`,
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
                .setCustomId("voltar0")
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
              .setDescription(`> Se você deseja alterar a mensagem do painel de tickets, terá que usar as seguintes variáveis:\n{user}\n-# Mencionar o usuário que abriu o ticket\n{codigo}\n-# Ver o código do ticket.\n{assumido}\n-# Ver quem assumiu o ticket.\n{motivo}\n-# Ver o motivo do ticket.
            `),
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
                .setStyle(ButtonStyle.Primary),
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

      // ALTERAR MENSAGEM DO PAINEL
      if (interaction.customId === "alterar_painel") {
        interaction.reply({
          content: "Envie a mensagem do painel de tickets:",
          flags: 64,
        });

        const collector = channel.createMessageCollector({
          filter: (msg) => msg.author.id === user.id,
          max: 1,
          time: 60000,
        });

        collector.on("collect", (msg) => {
          msg.delete();
          const mensagem = msg.content;

          // Atualizando a variável e o arquivo JSON
          ticket.config_dentro.texto = mensagem;

          fs.writeFileSync(
            path.join(__dirname, "../json/config.ticket.json"), // Caminho absoluto para evitar erros
            JSON.stringify(ticket, null, 2),
          );

          interaction.editReply({
            content: `A mensagem do Painel de Tickets foi alterada para\n-# ${mensagem}`,
            flags: 64,
          });
        });
      }
      // ALTERAR BANNER DO PAINEL
      if (interaction.customId === "alterar_banner") {
        interaction.reply({
          content: "Envie o link da imagem:",
          flags: 64,
        });

        const collector = channel.createMessageCollector({
          filter: (msg) => msg.author.id === user.id,
          max: 1,
          time: 60000,
        });

        collector.on("collect", (msg) => {
          msg.delete();
          const banner = msg.content;

          // Atualizando a variável e o arquivo JSON
          ticket.config_dentro.texto = banner;

          fs.writeFileSync(
            path.join(__dirname, "../json/config.ticket.json"), // Caminho absoluto para evitar erros
            JSON.stringify(ticket, null, 2),
          );

          interaction.editReply({
            content: `O banner do Ticket foi alterado para: ${banner}`,
            flags: 64,
          });
        });
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
                `Olá ${interaction.user}. Seja bem-vindo ao painel de gerenciamento de tickets.\n-# Aqui você pode personalizar o painel do seu ticket, configurar canais e muito mais...`,
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
                .setCustomId("voltar0")
                .setLabel("Voltar")
                .setStyle(ButtonStyle.Secondary),
            ),
          ],
          flags: 64,
        });
      }

      // GERENCIAR PERMISSÕES
      if (interaction.customId === "permissoes") {
        const lista_Usuarios = Object.keys(perms);

        // Formatar a lista de usuários para exibição
        const listaUsuarios = lista_Usuarios
          .map((userId) => `\n> ID: ${userId} | <@${userId}>`)
          .join("");

        interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("Gerenciar Permissões")
              .setDescription(
                `Usuários com permissão no bot: ${listaUsuarios}\nDono do bot: <@${config.owner}>`,
              )
              .setColor(config.color),
          ],
          components: [
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Adicionar Permissão")
                .setCustomId("add_perm")
                .setStyle(Discord.ButtonStyle.Primary),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Remover Permissão")
                .setCustomId("rem_perm")
                .setStyle(Discord.ButtonStyle.Primary),
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
              new ButtonBuilder()
                .setCustomId("tickets")
                .setLabel("Gerenciar Sistema de Tickets")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("⚙️"),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("permissoes")
                .setLabel("Gerenciar Permissões")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("🔑"),
            ),
            new Discord.ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("vips")
                .setLabel("Gerenciar Sistema de Vips")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("💎"),
            ),
          ],
          flags: 64,
        });
      }
    }
  },
};
