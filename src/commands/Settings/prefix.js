/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'prefix',
    tag: 'Prefix Tools: subcommands for the server prefix.',
    desription: 'Prefix Tools: Allows for viewing, setting and resetting the server prefix. The new prefix can have letters and the characters below. It cannot be longer than 5 characters.\n\n```\n! ? + - ~ \' ^ * ` ; , : . < > @ & %  / $ ( ) £ #\n```',
    usage: 'prefix\nprefix set <Prefix>\nprefix reset',
    userPerms: 32n,
    guildOnly: true,
    modBypass: true,
    async run(client, { guild, channel }, args) {
        try {
            if (args.length) {
                if (args[0].toLowerCase() === 'set') {
                    if (!args[1]) return client.errEmb('Insufficient arguments\n```\nprefix set <Prefix>\n```', channel);
                    const prefix = args.slice(1).join(' ');
                    if (prefix.length > 5) return client.errEmb('New prefix is too long.', channel);
                    if (/[^a-zA-Z!\?+-~'\^*`;,:.<>@&%\\/$()£#]+/gi.test(prefix)) return client.errEmb('New prefix contains illegal characters (see `help prefix`).', channel);
                    const db = client.db('guild');
                    const data = await db.get(guild.id);
                    if (data.prefix === prefix) return client.infoEmb('No changes were made.'. channel);
                    await db.update(guild.id, { prefix });
                    return client.checkEmb(`Prefix successfully updated to \`${prefix}\`!`, channel);
                } else if (args[0].toLowerCase() === 'reset') {
                    await client.db('guild').update(guild.id, { prefix: client.config.prefix });
                    return client.checkEmb('Prefix successfully reset!', channel);
                }
            }
            const data = await client.db('guild').get(guild.id);
            const embed = new MessageEmbed()
                .setDescription(`Current Prefix: \`${data.prefix}\`\n\nDefault Prefixes: \`r!\`, <@${client.user.id}>`)
                .setColor(0x1e143b)
                .setFooter('Note: DM commands do not require a prefix.');
            return channel.send({ embeds: [embed] });
        } catch {
            return client.errEmb('This command cant be used at this time.', channel);
        }
    }
}
