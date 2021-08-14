/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'prefix',
    tag: 'Shows the current prefix for the server',
    desription: 'Shows the current prefix for the server.',
    guildOnly: true,
    async run(client, message) {
        try {
            const data = await client.db('guild').get(message.guild.id);
            const embed = new MessageEmbed()
            .setDescription(`Current Prefix: \`${data.prefix}\`\n\nDefault Prefixes: \`r!\`, <@${client.user.id}>`)
            .setColor(0x1e143b)
            .setFooter('Note: DM commands do not require a prefix.');
            return message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            return client.errEmb('This command cant be used at this time.', message);
        }
    }
}
