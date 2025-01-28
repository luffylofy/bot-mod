const Discord = require("discord.js");

module.exports = {
    name: "serverinfo",
    description: "Exibe informações detalhadas sobre o servidor.",

    run: async (client, interaction, args) => {
        const guild = interaction.guild;

        // Contagem de membros
        const membros = guild.memberCount;

        // Contagem de cargos (excluindo cargos não atribuídos)
        const cargos = guild.roles.cache.filter(role => role.name !== "@everyone").size;

        // Contagem de canais
        const canais = guild.channels.cache.size;

        // Contagem de canais de texto e voz, incluindo os dentro de categorias
        const chats = guild.channels.cache.filter(canal => canal.type === Discord.ChannelType.GuildText).size;
        const calls = guild.channels.cache.filter(canal => canal.type === Discord.ChannelType.GuildVoice).size;

        // Contagem de emojis
        const emojis = guild.emojis.cache.size;

        // Dono do servidor
        const dono = await guild.fetchOwner();

        // Contagem de impulsos
        const impulsos = guild.premiumSubscriptionCount;

        // Data de criação
        const data = guild.createdAt.toLocaleDateString("pt-br");

        const embed = new Discord.EmbedBuilder()
            .setColor("#00FF7F") // Verde mais claro e agradável
            .setTitle(`${guild.name} - Informações do Servidor`)
            .setDescription(`Aqui estão os detalhes do servidor **${guild.name}**! 🏰`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 2048 })) // Ícone do servidor
            .setTimestamp() // Marca a data e hora da resposta
            .setFooter({ text: `Solicitado por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() }) // Quem solicitou o comando

            .addFields(
                {
                    name: "> 🔑 **Informações Principais**",
                    value: `**Dono:** ${dono.user.tag}\n**Membros:** \`${membros}\`\n**Impulsos Nitro:** \`${impulsos}\`\n**ID do Servidor:** \`${guild.id}\``,
                    inline: false,
                },
                {
                    name: "> 🗣 **Canais**",
                    value: `**Total de Canais:** \`${canais}\`\n**Canais de Texto:** \`${chats}\`\n**Canais de Voz:** \`${calls}\``,
                    inline: false,
                },
                {
                    name: "> 💼 **Cargos**",
                    value: `**Total de Cargos:** \`${cargos}\``,
                    inline: true,
                },
                {
                    name: "> 😎 **Emojis**",
                    value: `**Emojis Personalizados:** \`${emojis}\``,
                    inline: true,
                },
                {
                    name: "> 📅 **Data de Criação**",
                    value: `**Criado em:** \`${data}\``,
                    inline: false,
                }
            );

        interaction.reply({ embeds: [embed] });
    }
};
