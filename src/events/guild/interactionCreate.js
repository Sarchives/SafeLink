const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const command = !interaction.isButton()
            ? interaction.client.commands.get(interaction.commandName)
            : interaction.client.commands.get(interaction.customId);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (err) {
            interaction.client.logger.error(
                process.env.NODE_ENV === 'production' ? err.message : err.stack
            );

            await interaction.reply({
                ephemeral: true,
                embeds: [
                    new MessageEmbed()
                        .setColor('#ED4245')
                        .setTitle('🚫 An error occurred')
                        .setDescription('An error occurred while running this command.')
                        .addField('Details', `\`\`\`${err.message}\`\`\``),
                ],
            });
        }
    },
};
