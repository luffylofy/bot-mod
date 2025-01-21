const Discord = require("discord.js");
    const vips = require("../json/vips.json");
    const fs = require("fs");
    const {
      ActionRowBuilder,
      ButtonBuilder,
      ButtonStyle,
      EmbedBuilder,
      StringSelectMenuBuilder,
    } = require("discord.js");
    const config = require("../config.js");

    module.exports = {
      name: "vip",
      async execute(interaction) {
        if (interaction.customId === "setar") {
          interaction.update({
            embeds: [
              new EmbedBuilder()
                .setTitle("Sistema de VIPs")
                .setDescription("Utilize os botões abaixo para adicionar ou remover o VIP de um usuário.")
                .setColor(config.color),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setLabel("Adicionar Vip em um Membro")
                  .setCustomId("addvip")
                  .setEmoji("➕")
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setLabel("Remover Vip de um Membro")
                  .setCustomId("remvip")
                  .setEmoji("➖")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setLabel("Voltar")
                  .setCustomId("voltarvip2")
                  .setStyle(ButtonStyle.Secondary)
              ),
            ],
          });
        }

        if (interaction.customId === "addvip") {
          const timeSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("select_vip_time")
            .setPlaceholder("Selecione a duração do VIP")
            .addOptions(
              { label: "1 Mês", value: "1" },
              { label: "3 Meses", value: "3" },
              { label: "6 Meses", value: "6" }
            );

          interaction.update({
            embeds: [
              new EmbedBuilder()
                .setDescription("Escolha por quanto tempo você quer adicionar o VIP.")
                .setColor(config.color),
            ],
            components: [new ActionRowBuilder().addComponents(timeSelectMenu)],
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
          const row = new StringSelectMenuBuilder()
            .setCustomId("select_member")
            .setPlaceholder("Selecione um membro")
            .addOptions(memberOptions);

          interaction.update({
            embeds: [
              new EmbedBuilder()
                .setDescription(`Você selecionou VIP por ${vipDuration} mês(es). Agora, selecione um membro para adicionar ao VIP.`)
                .setColor(config.color),
            ],
            components: [new ActionRowBuilder().addComponents(row)],
          });

          interaction.user.vipDuration = vipDuration;
        }

        if (interaction.customId === "select_member") {
          const memberId = interaction.values[0];
          const member = interaction.guild.members.cache.get(memberId);

          if (!member) {
            return interaction.reply({
              content: "Membro não encontrado.",
              ephemeral: true,
            });
          }

          const vipRole = interaction.guild.roles.cache.get(config.cargovip);
          if (!vipRole) {
            return interaction.reply({
              content: "Cargo VIP não encontrado.",
              ephemeral: true,
            });
          }

          const vipDuration = interaction.user.vipDuration;
          const expirationDate = new Date();
          expirationDate.setMonth(expirationDate.getMonth() + parseInt(vipDuration));

          try {
            await member.roles.add(vipRole);

            const existingVipIndex = vips.vips.findIndex((vip) => vip.id === memberId);
            if (existingVipIndex === -1) {
              vips.vips.push({
                id: memberId,
                duration: vipDuration,
                timestamp: expirationDate.toISOString(),
              });
            } else {
              vips.vips[existingVipIndex].duration = vipDuration;
              vips.vips[existingVipIndex].timestamp = expirationDate.toISOString();
            }

            fs.writeFileSync("./json/vips.json", JSON.stringify(vips, null, 2));
            interaction.reply({
              content: `${member.user.tag} agora tem o cargo VIP por ${vipDuration} mês(es)!`,
              ephemeral: true,
            });
          } catch (error) {
            console.error(error);
            interaction.reply({
              content: "Houve um erro ao adicionar o cargo VIP.",
              ephemeral: true,
            });
          }
        }


    if (interaction.customId === "remvip") {
      const members = interaction.guild.members.cache.map((member) => ({
        label: member.user.tag,
        value: member.id,
      }));

      const row = new StringSelectMenuBuilder()
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

      const vipRole = interaction.guild.roles.cache.get(config.cargovip);
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
              .setStyle(ButtonStyle.Secondary)
          ),
        ],
      });
    }

    if (interaction.customId === "voltarvip1") {
      const embedconfig = new EmbedBuilder()
        .setTitle("Sistema de VIPs")
        .setColor(config.color)
        .setDescription(`Bom dia, ${interaction.user}. O que deseja fazer?`)
        .addFields(
          { name: "Versão do Bot", value: "1.0.0" },
          { name: "Ping", value: "`31 MS`" }
        );

      const vip1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("setar")
          .setLabel("Adicionar/Remover Vip")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("⚙️")
      );

      const vip2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("listavip")
          .setLabel("Lista de Membros Vip")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("🔑")
      );

      interaction.update({
        embeds: [embedconfig],
        components: [vip1, vip2],
      });
    }
  },
};
