const { MessageEmbed } = require('discord.js');

const checkLinks = require('../../api/safeBrowsing');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const guild = message.guild.id;
        const setupInfo = message.client.database.setupInfo;

        const entry = await setupInfo.findOne({ where: { guild } });

        checkLinks(message.client, message.cleanContent).then((data) => {
            if (data.response.matches !== undefined) {
                const threatArray = [];

                data.response.matches.forEach((match) => {
                    const threat = match.threatType.toLowerCase().split('_').join(' ');
                    const formattedThreat = threat[0].toUpperCase() + threat.substring(1);

                    if (threatArray.includes(formattedThreat)) return;
                    threatArray.push(formattedThreat);
                });

                if (entry) {
                    const logEmbed = new MessageEmbed()
                        .setColor('#FEE75C')
                        .setTitle('📃 New log')
                        .addField('Author', `${message.author} \`${message.author.id}\``)
                        .addField('Content', message.cleanContent.length > 1024 ?
                            message.cleanContent.slice(0, 1021).padEnd(1024, '.') :
                            message.cleanContent
                        )
                        .addField('Threats', threatArray.join(', '));

                    message.client.channels.cache.get(entry.logChannel).send({ embeds: [logEmbed] });
                }
                message.fetch(message.id).then((msg) => msg.delete());

                const removedEmbed = new MessageEmbed()
                    .setColor('#ED4245')
                    .setTitle('🚫 Message removed')
                    .setDescription(`Message automatically removed: **Dangerous link(s) - ${threatArray.join(', ')}**`);

                message.channel.send({ embeds: [removedEmbed] });
            }
        });
    },
};
