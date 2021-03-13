const { MessageEmbed } = require('discord.js');
const Guild = require('../../schemas/guild-schema');

module.exports = {
    name: 'automod',
    description: 'Shows the current automod config and allows for them to be edited using the subcommands below.',
    usage: 'automod <enable|disable> <all|invites|anti-spam|mass-mention|badwords>\nautomod logchannel <Channel:Mention/ID>\nautomod logchannel remove\nautomod mention-limit <Number>\nautomod mention-limit reset\nautomod badwords list\nautomod badwords <add|remove> [...words]',
    cooldown: 3,
    permissions: 32,
    guildOnly: true,
    modBypass: true,
    run: async (client, message, args) => {
        const data = await Guild.findOne({guildID: message.guild.id})
        .catch(console.error);
        if (!data) return client.errEmb('Unknown: Failed Connecting to `Automod`. Try contacting support.', message);
        const { automod } = data;

        if (!args.length) {
            switch (automod.active) {
                case true: active = 'enabled'; break;
                case false: active = 'disabled'; break;
                default: active = 'unknown'; break;
            }
            let channel = 'None Set';
            if (automod.channel) channel = `<#${automod.channel}>`;
            switch (automod.invites) {
                case true: invites = '<:checkgreen:796925441771438080> enabled'; break;
                case false: invites = '<:crossred:796925441490681889> disabled'; break;
                default: invites = '⚠'; break;
            }
            switch (automod.rateLimit) {
                case true: rateLimit = '<:checkgreen:796925441771438080> enabled'; break;
                case false: rateLimit = '<:crossred:796925441490681889> disabled'; break;
                default: rateLimit = '⚠'; break;
            }
            switch (automod.massMention.active) {
                case true: mentions = '<:checkgreen:796925441771438080> enabled'; break;
                case false: mentions = '<:crossred:796925441490681889> disabled'; break;
                default: mentions = '⚠'; break;
            }
            switch (automod.badWords.active) {
                case true: badwords = '<:checkgreen:796925441771438080> enabled'; break;
                case false: badwords = '<:crossred:796925441490681889> disabled'; break;
                default: badwords = '⚠'; break;
            }

            const embed = new MessageEmbed()
            .setTitle('Automod Settings')
            .setDescription(`The automod for this server is currently ${active}. You can toggle it using the \`automod <enable|disable>\` command.`)
            .addFields(
                {name: 'Log Channel', value: channel, inline: true},
                {name: 'Anti-Invites', value: invites, inline: true},
                {name: 'Anti-Spam', value: rateLimit, inline: true},
                {name: 'Mass-Mentions', value: `${mentions}\nThreshold: ${automod.massMention.thres}`, inline: true},
                {name: 'Swear Filter', value: `${badwords}\nType \`automod badwords list\` to view current ones.`, inline: true}
            )
            .setColor(0x1e143b)
            .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send(embed);
        } else {
            const sub = args[0].toLowerCase();
            const Active   = automod.active,
                Channel    = automod.channel,
                Invites    = automod.invites,
                Ratelimit  = automod.rateLimit,
                Mentions   = automod.massMention,
                Badwords   = automod.badWords;
            let _active    = automod.active,
                _channel   = automod.channel,
                _invites   = automod.invites,
                _ratelimit = automod.rateLimit,
                _mentions  = automod.massMention,
                _badwords  = automod.badWords;

            if (sub === 'enable') {
                if (!args[1]) return client.errEmb('No Plugin Specified.\n```\nautomod enable <plugin>\n```', message);
                const p = args[1].toLowerCase();
                if (p === 'all') {
                    _active = true;
                    _invites = true;
                    _ratelimit = true;
                    _mentions.active = true;
                    _badwords.active = true;
                } else if (p === 'invites') {
                    _invites = true;
                } else if (p === 'anti-spam') {
                    _ratelimit = true;
                } else if (p === 'mass-mention') {
                    _mentions.active = true;
                } else if (p === 'filter') {
                    _badwords.active = true;
                } else {
                    return client.errEmb('Unknown Option. See `help automod` for subcommands, plugins and options.', message);
                }

            } else if (sub === 'disable') {
                if (!args[1]) return client.errEmb('No Plugin Specified.\n```\nautomod enable <plugin>\n```', message);
                const p = args[1].toLowerCase();
                if (p === 'all') {
                    _active = false;
                    _invites = false;
                    _ratelimit = false;
                    _mentions.active = false;
                    _badwords.active = false;
                } else if (p === 'invites') {
                    _invites = false;
                } else if (p === 'anti-spam') {
                    _ratelimit = false;
                } else if (p === 'mass-mention') {
                    _mentions.active = false;
                } else if (p === 'filter') {
                    _badwords.active = false;
                } else {
                    return client.errEmb('Unknown Option. See `help automod` for subcommands, plugins and options.', message);
                }

            } else if (sub === 'logchannel') {
                if (args[1]) return client.errEmb('No Option Specified.\n```\nautomod logchannel <Channel:Mention/ID>\nautomod logchannel remove\n```', message);
                if (args[1].toLowerCase() === 'remove') {
                    if (!channel) return client.infoEmb('There is no Automod log channel setup.', message);
                    _channel = '';
                } else {
                    const chan = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
                    if (!chan) return client.errEmb('Unknown Channel Specified.', message);
                    if (chan.type != 'text') return client.errEmb('Specified Channel is not a default Text Channel.', message);
                    if (!chan.permissionsFor(message.guild.me).has(2048)) return client.errEmb('I am missing `Send Messages` permissions for that channel.', message);
                    _channel = chan.id;
                }

            } else if (sub === 'mention-limit') {
                if (!args[1]) return client.errEmb('No Option Specified.\n```\nautomod mention-limit <Number>\nautomod mention-limit reset\n```', message);
                if (args[1].toLowerCase() === 'reset') {
                    _mentions.thres = 5;
                } else {
                    const num = parseInt(args[1]);
                    if (isNaN(num)) return client.errEmb('Invalid Integer Specified.', message);
                    _mentions.thres = num;
                }

            } else if (sub === 'filter') {
                if (!args[1]) return client.errEmb('No Option Specified.\n```\nautomod filter list\nautomod filter add <...words>\nautomod filter remove <...words>\n```', message);
                const opt = args[1].toLowerCase();
                if (opt === 'list') {
                    if (!_badwords.list.length) return client.infoEmb('There are no badwords saved.', message);
                    const embed = new MessageEmbed()
                    .setTitle('Autmod: Filter List')
                    .setDescription(`Please view this list with discression.\n\`\`\`\n${_badwords.list.join('\n')}\n\`\`\``)
                    .setColor(0x1e143b)
                    .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                    return message.channel.send(embed);
                } else if (opt === 'add') {
                    if (!args[2]) return client.errEmb('No Words Provided.\n```\nautomod filter add <...words>\n```', message);
                    let addwords = args.slice(2).toLowerCase().trim().split(' ');
                    if (_badwords.list.length) {
                        addwords.filter(w => !badwords.list.includes(w))
                        .forEach(w => _badwords.list.push(w));
                    } else {
                        _badwords.list = addwords;
                    }
                } else if (opt === 'remove') {
                    if (!args[2]) return client.errEmb('No Words Provided.\n```\nautomod filter remove <...words>\n```', message);
                    let remwords = args.slice(2).toLowerCase().trim().split(' ');
                    if (_badwords.list.length) {
                        remwords.filter(w => _badwords.list.includes(w))
                        .forEach(w => _badwords.list.push(w));
                    } else {
                        _badwords.list = remwords;
                    }
                } else {
                    return client.errEmb('Unknown Filter Option. See `help automod` for subcommands, plugins and options.', message);
                }

            } else {
                return client.errEmb('Unknown Subcommand. See `help automod` for subcommands, plugins and options.', message);
            }

            if (
                _active == Active
                && _channel == Channel
                && _invites == Invites
                && _ratelimit == Ratelimit
                && _mentions.active == Mentions.active
                && _mentions.thres == Mentions.thres
                && _badwords.active == Badwords.active
                && _badwords.list.toString() == Badwords.list.toString()
            ) {
                console.log(_mentions, Mentions);
                return client.infoEmb('No changes were made to Automod settings.', message);
            } else {
                try {
                    await Guild.findOneAndUpdate(
                        { guildID: message.guild.id },
                        { $set:{ automod:{
                            active: _active,
                            channel: _channel,
                            invites: _invites,
                            rateLimit: _ratelimit,
                            massMention:{
                                active: _mentions.active,
                                thres: _mentions.thres
                            },
                            badWords:{
                                active: _badwords.active,
                                list: _badwords.list
                            }
                        }}},
                        { new: true }
                    );
                    return client.checkEmb('Successfully Updated Automod Settings!', message);
                } catch (err) {
                    console.error(err);
                    return client.errEmb('Unknown: Failed Updating Automod.\nTry contacting support if this error persists.', message);
                }
            }
        }
    }
}