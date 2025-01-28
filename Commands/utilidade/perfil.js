const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

module.exports = {
		name: "perfil",
		description: "Veja o seu perfil completo com informações detalhadas.",
		type: Discord.ApplicationCommandType.ChatInput,

		run: async (client, interaction) => {
				// Obtém a data de criação da conta do usuário
				const creationDate = interaction.user.createdAt.toLocaleDateString("pt-br");
				const avatar = interaction.user.displayAvatarURL({ dynamic: true });

				// Caminho para o arquivo vips.json
				const vipFilePath = path.join(__dirname, '../../json', 'vips.json');

				// Lê o arquivo vips.json
				let vipsData;
				try {
						vipsData = JSON.parse(fs.readFileSync(vipFilePath, 'utf-8'));
				} catch (error) {
						console.error('Erro ao ler o arquivo vips.json:', error);
						return interaction.reply('Desculpe, ocorreu um erro ao tentar acessar os dados de VIP.');
				}

				// Verifica se o usuário é VIP e obtém as informações
				const vipInfo = vipsData.vips.find(vip => vip.id === interaction.user.id);
				let vipStatus = "Não é VIP";
				let vipDuration = null;

				if (vipInfo && new Date(vipInfo.timestamp) > new Date()) {
						vipStatus = "VIP Ativo";
						const vipExpirationDate = new Date(vipInfo.timestamp);
						const duration = Math.floor((vipExpirationDate - new Date()) / (1000 * 60 * 60 * 24)); // Duração em dias
						vipDuration = duration > 0 ? `${duration} dias restantes` : "VIP expirada";
				}

				// Criação do embed
				const embed = new Discord.EmbedBuilder()
						.setThumbnail(avatar)
						.setColor(config.color)
						.setTitle(`Perfil de ${interaction.user.username}`)
						.setDescription(`Aqui estão os detalhes do seu perfil no servidor.`)
						.addFields(
								{
										name: `\\#️⃣ Tag`,
										value: `\`${interaction.user.tag}\``,
										inline: true
								},
								{
										name: `\\🆔 ID do Usuário`,
										value: `\`${interaction.user.id}\``,
										inline: true
								},
								{
										name: `\\📅 Data de Criação da Conta`,
										value: `\`${creationDate}\``,
										inline: false
								},
								{
										name: `\\🎖️ Status de VIP`,
										value: `\`${vipStatus}\``,
										inline: false
								}
						);

				// Adiciona o campo de duração do VIP, caso aplicável
				if (vipDuration) {
						embed.addFields({
								name: `\\⏳ Duração do VIP`,
								value: `\`${vipDuration}\``,
								inline: false
						});
				}

				// Envia o embed
				interaction.reply({
						embeds: [embed]
				});
		},
};
