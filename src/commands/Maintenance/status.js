/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { version: dcversion, MessageEmbed } = require('discord.js');
const { join } = require('path');
const { botOwners } = require('../../../config.json');
const { version } = require(join(process.cwd(), 'package.json')); 
const { toDurationDefault } = require('../../functions');

module.exports = {
    name: 'status',
    tag: 'Sends Radeon\'s status',
    description: 'Sends the bot\'s status for that guild.',
    cooldown: 5,

    run(client, message) {
        const { heapUsed, heapTotal } = process.memoryUsage();
        const embed = new MessageEmbed()
            .setTitle('Radeon Status (Total)')
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(0x1e143b)
            .addField('Owners', `<@${botOwners.join('>\n<@')}>`, true)
            .addField('Version', version, true)
            .addField('Discord.js', dcversion, true)
            .addField('NodeJS', process.version, true)
            .addField('Shards', client.shard.count.toString(), true)
            .addField('Servers', client.guilds.cache.size.toString(), true)
            .addField('Channels', client.channels.cache.size.toString(), true)
            .addField('Users', client.users.cache.size.toString(), true)
            .addField('Stats', `${client.stats.commands.size} Commands ran\n${client.stats.events} Events processed\n${client.stats.messages} Messages seen\n${client.stats.background} Background Tasks ran`, true)
            .addField('Uptime', toDurationDefault(Date.now() - client.uptime).replace('ago', ''), true)
            .addField('Memory', `${Math.floor(heapUsed / 1024)}/${Math.floor(heapTotal / 1024)} MB (${Math.floor((heapUsed / heapTotal) * 100)}%)`, true)
            .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send({ embeds:[embed] });
    },

    slash(client, { message }) { this.run(client, message) }
}
