const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const config = require("../../config.js");
const Discord = require("discord.js");
const vips = require("../../json/vips.json");

module.exports = {
  name: "tempovip",
  description: "[⏰] Veja o tempo do seu vip.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    // Pega o membro que executou o comando (a pessoa que invocou)
    const member = interaction.member;

    // Pega o cargo VIP do config.json
    const vipRole = interaction.guild.roles.cache.get(config.cargovip);
    if (!vipRole) {
      return interaction.reply({
        content: "Cargo VIP não encontrado.",
        flags: 64,
      });
    }

    // Verifica se o membro tem o cargo VIP
    const hasVipRole = member.roles.cache.has(vipRole.id);
    let vipData = null;

    if (hasVipRole) {
      // Busca o tempo do VIP no arquivo JSON
      vipData = vips.vips.find((vip) => vip.id === member.id);
      if (!vipData) {
        return interaction.reply({
          content: `${member.user.tag} não está registrado como VIP.`,
          flags: 64,
        });
      }
    }

    const embedColor = hasVipRole ? "#00FF00" : "#FF0000";
    const embed = new EmbedBuilder()
      .setTitle("Status do seu VIP")
      .setColor(embedColor)
      .setDescription(
        hasVipRole
          ? `🎉 **Duração do VIP:** ${vipData.duration} mês(es)\n⏳ **Tempo restante:** ${getRemainingTime(vipData.timestamp)}`
          : `🚫 **Você não possuí VIP atualmente. Caso queira adquirir, clique no botão abaixo.**`,
      );

    if (!hasVipRole) {
      // Criando o botão de link quando o usuário não tem o VIP
      const button = new ButtonBuilder()
        .setLabel("Adquirir VIP")
        .setURL(
          "https://discord.com/channels/1329293502638456935/1329293503787700232",
        ) // Substitua pelo link correto
        .setStyle(ButtonStyle.Link);

      // Criando a linha de componentes para adicionar o botão
      const row = new ActionRowBuilder().addComponents(button);

      // Enviar a embed com o botão
      interaction.reply({ embeds: [embed], components: [row] });
    } else {
      // Enviar a embed sem o botão caso o usuário tenha o VIP
      interaction.reply({ embeds: [embed] });
    }

    // Função para calcular o tempo restante até a expiração do VIP
    function getRemainingTime(expirationTimestamp) {
      const currentDate = new Date();

      // Verifica se o timestamp é válido
      const expirationDate = new Date(expirationTimestamp);
      if (isNaN(expirationDate.getTime())) {
        return "Data de expiração inválida!";
      }

      const timeRemaining = expirationDate - currentDate;

      if (timeRemaining <= 0) {
        return "VIP expirado!";
      }

      const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hoursRemaining = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutesRemaining = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60),
      );

      return `${daysRemaining} dias, ${hoursRemaining} horas, ${minutesRemaining} minutos.`;
    }
  },
};
