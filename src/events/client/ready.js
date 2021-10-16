const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        client.logger.info(`Logged in as ${client.user.tag}.`);

        const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

        rest.put(
            process.env.NODE_ENV === 'production'
                ? Routes.applicationCommands(client.user.id)
                : Routes.applicationGuildCommands(client.user.id, client.guild),
            { body: client.commandArray }
        ).then(() =>
            client.logger.info('Successfully registered application commands.')
        ).catch((err) => client.logger.error(err));
    },
};
