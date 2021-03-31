const { MessageEmbed } = require('discord.js');
const Guild = require('../../schemas/guild-schema');

module.exports = {
    name: 'prefix',
    tag: 'Shows the current prefix for the server',
    desription: 'Shows the current prefix for the server.',
    guildOnly: true,
    run: async (client, message) => {
        try {
            const data = await Guild.findOne({guildID: message.guild.id});
            const embed = new MessageEmbed()
            .setDescription(`Current Prefix: \`${data.prefix}\`\n\nDefault Prefixes: \`r!\`, <@${client.user.id}>`)
            .setColor(0x1e143b)
            .setFooter('Note: DM commands do not require a prefix.');
            return message.channel.send(embed);
        } catch (err) {
            console.error(err);
            return client.errEmb('This command cant be used at this time.', message);
        }
    }
}
