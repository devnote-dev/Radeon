/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { version: dcversion, MessageEmbed } = require('discord.js');
const { join } = require('path');
const { version } = require(join(process.cwd(), 'package.json')); 
const { toDurationDefault } = require('../../functions/functions');

module.exports = {
    name: 'status',
    tag: 'Sends Radeon\'s status',
    description: 'Sends the bot\'s status for that guild.',
    cooldown: 5,
    async run(client, message) {
        const { heapUsed, heapTotal } = process.memoryUsage();
        const embed = new MessageEmbed()
        .setTitle('Radeon Status (Total)')
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(0x1e143b)
        .addField('Owners', `<@${client.config.botOwners.join('>\n<@')}>`, true)
        .addField('Version', version, true)
        .addField('Discord.js', dcversion, true)
        .addField('NodeJS', process.version, true)
        .addField('Shards', client.shard.count, true)
        .addField('Servers', client.guilds.cache.size, true)
        .addField('Channels', client.channels.cache.size, true)
        .addField('Users', client.users.cache.size, true)
        .addField('Stats', `${client.stats.commands} Commands ran\n${client.stats.events} Events processed\n${client.stats.messages} Messages seen\n${client.stats.background} Background Tasks ran`, true)
        .addField('Uptime', toDurationDefault(Date.now() - client.uptime).replace('ago', ''), false)
        .addField('Memory', `${Math.floor(heapUsed / 1024)}/${Math.floor(heapTotal / 1024)} MB (${Math.floor((heapUsed / heapTotal) * 100)}%)`)
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send(embed);
    }
}
