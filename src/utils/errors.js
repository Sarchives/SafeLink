const { MessageEmbed } = require('discord.js');

const baseEmbed = new MessageEmbed()
    .setColor('#ED4245')
    .setTitle('🚫 An error occurred');

module.exports.commandError = function(err) {
    const embed = baseEmbed
        .setDescription('An error occurred while running this command.')
        .addField('Details', `\`\`\`${err.message}\`\`\``);

    return embed;
};

module.exports.dbError = function(err) {
    const embed = baseEmbed
        .setDescription('An error occurred while writing to the database.')
        .addField('Details', `\`\`\`${err}\`\`\``);

    return embed;
};
