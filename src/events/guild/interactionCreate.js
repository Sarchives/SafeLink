const { commandError } = require('../../utils/errors');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const command = !interaction.isButton()
            ? interaction.client.commands.get(interaction.commandName)
            : interaction.client.commands.get(interaction.customId);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            interaction.client.logger.error(error);

            await interaction.reply({
                ephemeral: true,
                embeds: [commandError(error)],
            });
        }
    },
};
