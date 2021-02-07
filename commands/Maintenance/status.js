const Discord = require('discord.js');
const {version} = require('../../package.json');

module.exports = {
    name: 'status',
    description: 'Sends the bot\'s status for that guild. For the whole bot status use the `` command.',
    run: async (client, message) => {
        function duration(ms) {
            const sec = Math.floor((ms / 1000) % 60).toString()
            const min = Math.floor((ms / (1000 * 60)) % 60).toString()
            const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24).toString()
            const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
            return `${days.padStart(1, `0`)} days, ${hrs.padStart(2, `0`)} hours, ${min.padStart(2, `0`)} mins, ${sec.padStart(2, `0`)} secs`;
        }
        const {heapUsed, heapTotal} = process.memoryUsage();
        const embed = new Discord.MessageEmbed()
        .setTitle('Radeon Status (Total)')
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(0x1e143b)
        .addField('Owners', `<@${client.config.botOwners.join('>\n<@')}>`, true)
        .addField('Version', version, true)
        .addField('DiscordJS', Discord.version, true)
        .addField('NodeJS', process.version, true)
        .addField('Shards', client.shard.count, true)
        .addField('Servers', client.guilds.cache.size, true)
        .addField('Channels', client.channels.cache.size, true)
        .addField('Users', client.users.cache.size, true)
        .addField('Uptime', duration(client.uptime), false)
        .addField('Memory', `${Math.floor(heapUsed / 1024)}/${Math.floor(heapTotal / 1024)} MB (${Math.floor((heapUsed / heapTotal) * 100)}%)`)
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
        message.channel.send(embed);
    }
}
