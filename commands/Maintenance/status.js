const Discord = require('discord.js');
const { version } = require('../../package.json');
const { toDurationDefault } = require('../../functions/functions');

module.exports = {
    name: 'status',
    tag: 'Sends Radeon\'s status',
    description: 'Sends the bot\'s status for that guild.',
    run: async (client, message) => {
        const { heapUsed, heapTotal } = process.memoryUsage();
        const embed = new Discord.MessageEmbed()
        .setTitle('Radeon Status (Total)')
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(0x1e143b)
        .addField('Owners', `<@${client.config.botOwners.join('>\n<@')}>`, true)
        .addField('Version', version, true)
        .addField('Discord.js', Discord.version, true)
        .addField('NodeJS', process.version, true)
        .addField('Shards', client.shard.count, true)
        .addField('Servers', client.guilds.cache.size, true)
        .addField('Channels', client.channels.cache.size, true)
        .addField('Users', client.users.cache.size, true)
        .addField('Stats', `${client.stats.commands} Commands ran\n${client.stats.events} Events processed\n${client.stats.messages} Messages seen\n${client.stats.background} Background Tasks ran`, true)
        .addField('Uptime', toDurationDefault(client.uptime), false)
        .addField('Memory', `${Math.floor(heapUsed / 1024)}/${Math.floor(heapTotal / 1024)} MB (${Math.floor((heapUsed / heapTotal) * 100)}%)`)
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send(embed);
    }
}
