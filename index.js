const Discord = require("discord.js")

const config = require("./config.json")

const client = new Discord.Client({ 
  intents: [ 
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers,
    '32767'
       ]
    });
const { ActivityType } = Discord;

client.on('ready', () => {
  console.log(`✅ | Bot logado com sucesso em ${client.user.username}!`)
  client.user.setActivity(`The Chosens!`, { type: ActivityType.Playing })
})

module.exports = client

client.on('interactionCreate', (interaction) => {

  if(interaction.type === Discord.InteractionType.ApplicationCommand){

      const cmd = client.slashCommands.get(interaction.commandName);

      if (!cmd) return interaction.reply(`Error`);

      interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

      cmd.run(client, interaction)

   }
})

client.slashCommands = new Discord.Collection()

require('./handler')(client)

client.login(config.token)

process.on('unhandRejection', (reason, promise) => {
  console.log(`🚫 Erro Detectado:\n\n` + reason, promise)
});
process.on('uncaughtException', (error, origin) => {
  console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});

client.on("interactionCreate", require('./events/setar').execute);
client.on("interactionCreate", require('./events/ticket').execute);
client.on("interactionCreate", require('./events/botconfig').execute);
client.on("interactionCreate", require('./events/guildMemberAdd.js').execute);