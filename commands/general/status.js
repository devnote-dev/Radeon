/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright 2021 Radeon Development
 */

const { version } = require('../../package.json');
const { botOwners } = require('../../config.json');
const { version: djsv, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'status',
    tag: 'Sends Radeon\'s status',
    description: 'Sends Radeon\'s status for the server'
}

exports.run = (client, message) => {
    const { heapUsed, heapTotal } = process.memoryUsage();
    const embed = new MessageEmbed()
        .setTitle('Radeon Status')
        .setThumbnail(client.user.displayAvatarURL())
        .addField('Owners', '<@'+ botOwners.join('>\n<@') +'>', true)
        .addField('Version', version, true)
        .addField('Library Version', djsv, true)
        .addField('Node Version', process.version, true)
        .addField('Shards', client.shard.count.toString(), true)
        .addField('Servers', client.servers.cache.size.toString(), true)
        .addField('Channels', client.channels.cache.size.toString(), true)
        .addField('Users', client.users.cache.toString(), true)
        .addField('Memory', `${Math.floor(heapUsed / 1024)}/${Math.floor(heapTotal / 1024)} MB (${Math.floor((heapUsed / heapTotal) * 100)}%)`, true)
        .setColor(client.const.col.def)
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
    message.channel.send({ embeds:[embed] });
}
