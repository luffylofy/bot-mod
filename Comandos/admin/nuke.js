const { ChannelType } = require("discord.js");

module.exports = {
    name: "nuke",
    description: "[⚙️] Exclui e recria o canal onde o comando foi executado.",
    type: 1, // ChatInput
    run: async (client, interaction) => {
        const { channel, user, guild } = interaction;

        // Verificar se o usuário é o proprietário do bot
        const ownerID = require("../../config.json").owner;
        if (user.id !== ownerID) {
            return interaction.reply({
                embeds: [
                    {
                        description: "Somente o proprietário do bot pode utilizar este comando.",
                        color: "2b2d31",
                    },
                ],
                flags: 64,
            });
        }

        // Backup do canal original (nome, permissões e posição)
        const channelName = channel.name;
        const channelPermissions = channel.permissionOverwrites.cache.map((perm) => ({
            id: perm.id,
            allow: perm.allow.bitfield,
            deny: perm.deny.bitfield,
        }));
        const channelPosition = channel.position; // Posição atual do canal na categoria

        // Deletar o canal original
        await channel.delete(`Comando de Nuke executado por ${user.tag}`);

        // Recriar o canal com as mesmas permissões, sem tópico, e na mesma posição
        const newChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            permissionOverwrites: channelPermissions,
            parent: channel.parent, // Mantém a categoria original
            reason: `Comando de Nuke executado por ${user.tag}`,
        });

        // Ajustar a posição do novo canal
        await newChannel.setPosition(channelPosition);

        // Enviar mensagem no novo canal
        await newChannel.send(`💥 Nuked by: ${user.tag}`);
    },
};
