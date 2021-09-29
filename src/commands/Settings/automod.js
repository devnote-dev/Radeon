/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');

const usage = 'automod <enable|disable> <all|invites|spam|floods|usernames|mentions|filter|zalgo>\n'+
    'automod logchannel <Channel:Mention/ID>\nautomod logchannel remove\n'+
    'automod floods [Limit:Number]\nautomod mentions [Limit:Number]\nautomod mentions unique\n'+
    'automod filter list\nautomod filter <add|remove> <...words>\nautomod zalgo [Limit:Number]';

module.exports = {
    name: 'automod',
    description: 'Automod Tools: shows the current automod config and allows for editing using subcommands.',
    usage,
    cooldown: 3,
    userPerms: 32n,
    guildOnly: true,
    modBypass: true,

    async run(client, message, args) {
        const db = await client.db('automod');
        const data = await db.get(message.guild.id);
        if (!data) return client.error('Unknown: Failed fetching database for this server. Try contacting support.', message);

        const { guild } = message;
        if (!args.length) {
            const logchannel = guild.channels.cache.get(data.channel);
            const mentions = `${getState(data.mentions.active)}\nThreshold: ${data.mentions.threshold}\nUnique: ${data.mentions.unique}`;
            const zalgo = `${getState(data.zalgo.active)}\nThreshold: ${data.zalgo.threshold}`;

            const embed = new MessageEmbed()
                .setTitle('Automod Settings')
                .setDescription(`The automod settings for this server are currently **${getState(data.active, false)}**. See \`help automod\` on how to edit these setttings.`)
                .addFields(
                    {name: 'Log Channel', value: logchannel.toString() || 'None Set', inline: true},
                    {name: 'Invites', value: getState(data.invites), inline: true},
                    {name: 'Spam (ratelimit)', value: getState(data.ratelimit), inline: true},
                    {name: 'Floods', value: getState(data.floods), inline: true},
                    {name: 'Usernames', value: getState(data.displayNames), inline: true},
                    {name: 'Mentions', value: mentions, inline: true},
                    {name: 'Filter', value: 'View with `automod filter`', inline: true},
                    {name: 'Zalgo', value: zalgo, inline: true},
                    {name: 'Rulesets', value: 'View with `automod rulesets`', inline: true}
                )
                .setColor(0x1e143b)
                .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send({ embeds:[embed] });
        }

        const copy = Object.assign(Object.create(data), {});
        const sub = args.lower[0],
            opt1 = args.lower[1],
            opt2 = args.lower.slice(2);

        if (sub === 'enable') {
            if (!opt1) return client.error('No option specified. See `help automod` for more information.', message);
            if (opt1 === 'all') {
                copy.active = true;
                copy.invites = true;
                copy.ratelimit = true;
                copy.floods = true;
                copy.displayNames = true;
                copy.mentions.active = true;
                copy.filter.active = true;
                copy.zalgo.active = true;
            } else if (opt1 === 'invites') copy.invites = true;
            else if (opt1 === 'spam') copy.ratelimit = true;
            else if (opt1 === 'floods') copy.floods = true;
            else if (opt1 === 'usernames') copy.displayNames = true;
            else if (opt1 === 'mentions') copy.mentions.active = true;
            else if (opt1 === 'filter') copy.filter.active = true;
            else if (opt1 === 'zalgo') copy.zalgo.active = true;
            else {
                return client.error('Invalid plugin option. See `help automod` for more information.', message);
            }

        } else if (sub === 'disable') {
            if (!opt1) return client.error('No option specified. See `help automod` for more information.', message);
            if (opt1 === 'all') {
                copy.active = false;
                copy.invites = false;
                copy.ratelimit = false;
                copy.floods = false;
                copy.displayNames = false;
                copy.mentions.active = false;
                copy.filter.active = false;
                copy.zalgo.active = false;
            } else if (opt1 === 'invites') copy.invites = false;
            else if (opt1 === 'spam') copy.ratelimit = false;
            else if (opt1 === 'floods') copy.floods = false;
            else if (opt1 === 'usernames') copy.displayNames = false;
            else if (opt1 === 'mentions') copy.mentions.active = false;
            else if (opt1 === 'filter') copy.filter.active = false;
            else if (opt1 === 'zalgo') copy.zalgo.active = false;
            else {
                return client.error('Invalid plugin option. See `help automod` for more information.', message);
            }

        } else if (sub === 'logchannel') {
            if (!opt1) return client.error('No option specified. See `help automod` for more information.', message);
            if (opt1 === 'remove') {
                copy.channel = '';
            } else {
                const chan = message.mentions.channels.first() || guild.channels.cache.get(opt1);
                if (!chan) return client.error('Channel not found!', message);
                if (chan.type !== 'GUILD_TEXT') return client.error('Channel is not a default text channel.', message);
                if (!chan.permissionsFor(guild.me).has(18432n)) return client.error('Missing permissions to __Send Messages__ and __Embed Links__ in that channel.', message);
                copy.channel = chan.id;
            }

        } else if (sub === 'floods') {
            if (!opt1) {
                copy.floods.threshold = 30;
            } else {
                try {
                    opt1 = parseInt(opt1);
                    if (isNaN(opt1)) return client.error('Plugin option: invalid threshold number.', message);
                    if (opt1 < 10 || opt1 > 50) return client.error('Plugin option: threshold must be between 10 and 50.', message);
                    copy.floods.threshold = opt1;
                } catch {
                    return client.error('Plugin option: invalid threshold number.', message);
                }
            }

        } else if (sub === 'mentions') {
            if (!opt1) {
                copy.mentions.threshold = 5;
            } else {
                if (opt1 === 'unique') {
                    copy.mentions.unique = !copy.mentions.unique;
                } else {
                    try {
                        const num = parseInt(opt1);
                        if (isNaN(num)) return client.error('Plugin option: invalid threshold number.', message);
                        if (num < 3 || num > 50) return client.error('Plugin option: threshold must be between 3 and 50.', message);
                        copy.mentions.threshold = num;
                    } catch {
                        return client.error('Plugin option: invalid threshold number.', message);
                    }
                }
            }

        } else if (sub === 'filter') {
            if (!opt1) return client.error('No option specified. See `help automod` for more information.', message);
            if (!opt2.length) return client.error(`Plugin option: missing words to ${opt1}.`, message);
            if (opt1 === 'add') {
                const words = opt2.filter(w => !copy.filter.list.includes(w));
                copy.filter.list.concat(words);
            } else {
                const words = opt2.filter(w => copy.filter.list.includes(w));
                copy.filter.list.concat(words);
            }

        } else if (sub === 'zalgo') {
            if (!opt1) {
                copy.zalgo.threshold = 30;
            } else {
                try {
                    const num = parseInt(opt1);
                    if (isNaN(num)) return client.error('Plugin option: invalid threshold number.', message);
                    if (num < 10 || num > 100) return client.error('Plugin option: threshold must be between 10 and 100.', message);
                    copy.zalgo.threshold = num;
                } catch {
                    return client.error('Plugin option: invalid threshold number.', message);
                }
            }

        } else {
            return client.error('Invalid plugin specified. See `help automod` for more information.', message);
        }

        await db.update(guild.id, copy);
        return client.check('Successfully updated automod settings!', message);
    }
}

function getState(opt, e=true) {
    return opt
    ? (e ? '<:checkgreen:796925441771438080>' : '') + 'enabled'
    : (e ? '<:crossred:796925441490681889>' : '') + 'disabled';
}
