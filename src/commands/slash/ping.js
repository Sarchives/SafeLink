const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Gets the bot and API latency.'),
};

module.exports.execute = (interaction) => {
    interaction.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#58ACBD')
                .setTitle('🏓 Pong!')
                .addFields({
                    name: 'Bot Latency',
                    value: `\`\`\`js\n${Math.round(Date.now() - interaction.createdAt)} ms\n\`\`\``,
                    inline: true,
                }, {
                    name: 'API Latency',
                    value: `\`\`\`js\n${Math.round(interaction.client.ws.ping)} ms\n\`\`\``,
                    inline: true,
                }),
        ],
    });
};
