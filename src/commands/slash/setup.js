const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');
const { dbError } = require('../../utils/errors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configures the bot.')
        .addChannelOption(option => option
            .setName('log-channel')
            .setDescription('The channel used for logging dangerous messages.')
            .setRequired(true)),
    execute(interaction) {
        const guild = interaction.guild.id;
        const logChannel = interaction.options.getChannel('log-channel');
        const setupData = interaction.client.database.setupInfo;

        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && !interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            return interaction.reply({ ephemeral: true, content: 'Sorry, you need to have Manage Server or Administrator permissions to execute this command.' });
        }

        if (logChannel.type !== 'GUILD_TEXT') {
            return interaction.reply({ ephemeral: true, content: 'Sorry, you must select a text channel.' });
        }

        const setupRow = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('setup_confirm')
                .setLabel('Confirm')
                .setStyle('DANGER'));

        const logDataEmbed = new MessageEmbed()
            .setColor('#58ACBD')
            .setTitle('📃 Log data')
            .addFields(
                { name: 'Guild ID', value: `\`\`\`${guild}\`\`\``, inline: true },
                { name: 'Log Channel ID', value: `\`\`\`${logChannel.id}\`\`\``, inline: true }
            );

        interaction.reply({ ephemeral: true, content: 'Is this data correct?', embeds: [logDataEmbed], components: [setupRow] });

        const filter = i => i.customId === 'setup_confirm' && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'setup_confirm') {
                setupRow.components[0].setDisabled(true);
                try {
                    const entry = await setupData.findOne({ where: { guild } });
                    if (entry) {
                        await setupData.destroy({ where: { guild } });
                    }
                    await setupData.create({
                        guild,
                        logChannel: logChannel.id,
                    });
                } catch (error) {
                    return interaction.followUp({
                        ephemeral: true,
                        embeds: [dbError(error)],
                    });
                }
                await i.reply({
                    ephemeral: true,
                    content: 'Updated database.',
                });
            }
        });
    }
};
