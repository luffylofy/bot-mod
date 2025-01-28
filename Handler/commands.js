const fs = require('fs').promises;
require('colors');
const Discord = require('discord.js');

async function commandsHandler(client) {
    const slashArray = [];
    const comandosCarregados = [];
    client.slashCommands = new Discord.Collection();

    try {
        // Lê as pastas dentro da pasta Commands
        const folders = await fs.readdir('./Commands');

        for (const subfolder of folders) {
            const folderPath = `./Commands/${subfolder}/`;

            try {
                // Lê os arquivos dentro da subpasta
                const files = await fs.readdir(folderPath);

                for (const file of files) {
                    // Verifica se o arquivo é um arquivo .js
                    if (!file.endsWith('.js')) continue;

                    const command = require(`../Commands/${subfolder}/${file}`);

                    // Verifica se o comando possui a propriedade 'name'
                    if (!command.name) {
                        console.warn(`Comando inválido sem 'name' encontrado em: ${file}`.yellow);
                        continue;
                    }

                    // Adiciona o comando à coleção
                    client.slashCommands.set(command.name, command);
                    slashArray.push(command);
                    comandosCarregados.push(command.name);

                    console.log(`Comando carregado: ${command.name}`.green);
                }

            } catch (err) {
                // Erro ao ler arquivos dentro da subpasta
                console.error(`Erro ao ler arquivos na pasta ${subfolder}: `.red, err);
            }
        }

        // Quando o bot estiver pronto, define os comandos nas guildas
        client.on('ready', () => {
            // Define os comandos para todas as guildas
            client.guilds.cache.forEach(guild => guild.commands.set(slashArray));
            console.log(`📘 Comandos Carregados: ${comandosCarregados.join(' , ')}`.blue);
        });

    } catch (error) {
        // Caso aconteça erro ao ler as pastas principais
        console.error('Erro ao carregar comandos: '.red, error);
    }
}

module.exports = commandsHandler;
