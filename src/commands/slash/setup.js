const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    Permissions,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sets up the bot for first use.')
        .addChannelOption((option) => option
            .setName('log-channel')
            .setDescription('The channel used for logging dangerous messages.')
            .setRequired(true)
        ),
};

module.exports.execute = async (interaction) => {
    const guild = interaction.guild.id;
    const logChannel = interaction.options.getChannel('log-channel');

    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        return interaction.reply({
            ephemeral: true,
            content: 'Sorry, you are not an administrator.',
        });
    }
    
    if (logChannel.type !== 'GUILD_TEXT') {
        return interaction.reply({
            ephemeral: true,
            content: 'Sorry, you must select a text channel.',
        });
    }

    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('setup_confirm')
            .setLabel('Confirm')
            .setStyle('DANGER')
    );

    interaction.reply({
        ephemeral: true,
        content: 'Is this data correct?',
        embeds: [
            new MessageEmbed()
                .setColor('#58ACBD')
                .setTitle('📃 Log data')
                .addFields({
                    name: 'Guild ID',
                    value: `\`\`\`${guild}\`\`\``,
                    inline: true,
                }, {
                    name: 'Log Channel ID',
                    value: `\`\`\`${logChannel.id}\`\`\``,
                    inline: true,
                }),
        ],
        components: [row],
    });

    const filter = (i) =>
        i.customId === 'setup_confirm' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 15000,
    });

    collector.on('collect', async (i) => {
        if (i.customId === 'setup_confirm') {
            row.components[0].setDisabled(true);
            try {
                await interaction.client.database.setupInfo.create({
                    guild,
                    logChannel: logChannel.id,
                });
            } catch (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    return interaction.followUp({
                        ephemeral: true,
                        content: 'This guild is already set up or that channel ID is already being used.',
                    });
                }
                return interaction.followUp({
                    ephemeral: true,
                    embeds: [
                        new MessageEmbed()
                            .setColor('#ED4245')
                            .setTitle('🚫 An error occurred')
                            .setDescription('An error occurred while adding to the database.')
                            .addField('Details', `\`\`\`${err.message}\`\`\``),
                    ],
                });
            }
            await i.reply({
                ephemeral: true,
                content: 'Added to database.',
            });
        }
    });
};
