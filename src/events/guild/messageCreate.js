const { MessageEmbed } = require('discord.js');

const checkLinks = require('../../api/safeBrowsing');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const setupData = await message.client.database.setupInfo.findOne({
            where: { guild: message.guild.id },
        });

        try {
            checkLinks(message.client, message.cleanContent).then((data) => {
                if (data.response.matches !== undefined) {
                    const threatArray = [];
                    data.response.matches.forEach((match) => {
                        const threat = match.threatType.toLowerCase().split('_').join(' ');
                        threatArray.push(
                            threat[0].toUpperCase() + threat.substring(1)
                        );
                    });
                    if (setupData) {
                        try {
                            message.client.channels.cache
                                .get(setupData.logChannel)
                                .send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor('#FEE75C')
                                            .setTitle('📃 New log')
                                            .addField('Author', `${message.author} \`${message.author.id}\``)
                                            .addField('Content', message.cleanContent.length > 1024 ?
                                                message.cleanContent.slice(0, 1021).padEnd(1024, '.') :
                                                message.cleanContent
                                            )
                                            .addField('Threats', threatArray.join(', ')),
                                    ],
                                });
                        } catch (err) {
                            message.client.logger.error(err);
                        }
                    }
                    message.fetch(message.id).then((msg) => msg.delete());
                    message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor('#ED4245')
                                .setTitle('🚫 Message removed')
                                .setDescription(`Message automatically removed: **Dangerous link - ${threatArray.join(', ')}**`),
                        ],
                    });
                }
            });
        } catch (err) {
            message.client.logger.error(
                process.env.NODE_ENV === 'production' ? err.message : err.stack
            );

            await message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#ED4245')
                        .setTitle('🚫 An error occurred')
                        .setDescription('An error occurred while executing this event.')
                        .addField('Details', `\`\`\`${err.message}\`\`\``),
                ],
            });
        }
    },
};
