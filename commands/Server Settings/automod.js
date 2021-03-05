const { MessageEmbed } = require('discord.js');
const Guild = require('../../schemas/guild-schema');

module.exports = {
    name: 'automod',
    description: 'Shows the current automod config and allows for them to be edited using the subcommands below.',
    usage: 'automod <enable|disable> <all|invites|anti-spam|mass-mention|badwords>\nautomod logchannel <Channel:Mention/ID>\nautomod logchannel remove\nautomod mention-limit <Number>\nautomod mention-limit reset\nautomod badwords list\nautomod badwords <add|remove> [...words]',
    permissions: 32,
    guildOnly: true,
    modBypass: true,
    run: async (client, message, args) => {
        const data = await Guild.findOne({guildID: message.guild.id});
        const {automod} = data;
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
            message.channel.send(embed);
        } else {
            if (args[0] === 'enable') {
                if (!args[1]) return client.errEmb('No Plugin Specified.\n```\nautomod enable <plugin>\n```', message);
                switch (args[1]) {
                    case 'all':
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ automod:{
                                active:true,
                                channel:automod.channel,
                                invites:automod.invites,
                                rateLimit:automod.rateLimit,
                                massMention:{active:automod.massMention.active,thres:automod.massMention.thres},
                                badWords:{active:automod.badWords.active,list:automod.badWords.list}}}},
                            { new: true }
                        );
                        client.checkEmb('Successfully Enabled the Main module!', message);
                        break;
                    case 'invites':
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ automod:{
                                active:automod.active,
                                channel:automod.channel,
                                invites:true,
                                rateLimit:automod.rateLimit,
                                massMention:{active:automod.massMention.active,thres:automod.massMention.thres},
                                badWords:{active:automod.badWords.active,list:automod.badWords.list}}}},
                            { new: true }
                        );
                        client.checkEmb('Successfully Enabled the Invites plugin!', message);
                        break;
                    case 'antispam':
                    case 'anti-spam':
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ automod:{
                                active:automod.active,
                                channel:automod.channel,
                                invites:automod.invites,
                                rateLimit:true,
                                massMention:{active:automod.massMention.active,thres:automod.massMention.thres},
                                badWords:{active:automod.badWords.active,list:automod.badWords.list}}}},
                            { new: true }
                        );
                        client.checkEmb('Successfully Enabled the Anti-Spam plugin!', message);
                        break;
                    case 'massmention':
                    case 'mass-mention':
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ automod:{
                                active:automod.active,
                                channel:automod.channel,
                                invites:automod.invites,
                                rateLimit:automod.rateLimit,
                                massMention:{active:true,thres:automod.massMention.thres},
                                badWords:{active:automod.badWords.active,list:automod.badWords.list}}}},
                            { new: true }
                        );
                        client.checkEmb('Successfully Enabled the Mass-Mention plugin!', message);
                        break;
                    case 'badwords':
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ automod:{
                                active:automod.active,
                                channel:automod.channel,
                                invites:automod.invites,
                                rateLimit:automod.rateLimit,
                                massMention:{active:automod.massMention.active,thres:automod.massMention.thres},
                                badWords:{active:true,list:automod.badWords.list}}}},
                            { new: true }
                        );
                        client.checkEmb('Successfully Enabled the BadWords plugin!', message);
                        break;
                    default:
                        client.errEmb(`Unknown Plugin \`${args[1]}\`. See \`help automod\` for subcommands and plugins.`, message);
                        break;
                }
            } else if (args[0] === 'disable') {
                if (!args[1]) return client.errEmb('No Plugin Specified.\n```\nautomod disable <plugin>\n```', message);
                switch (args[1]) {
                    case 'all':
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ automod:{
                                active:false,
                                channel:automod.channel,
                                invites:automod.invites,
                                rateLimit:automod.rateLimit,
                                massMention:{active:automod.massMention.active,thres:automod.massMention.thres},
                                badWords:{active:automod.badWords.active,list:automod.badWords.list}}}},
                            { new: true }
                        );
                        client.checkEmb('Successfully Disabled the Main module!', message);
                        break;
                    case 'invites':
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ automod:{
                                active:automod.active,
                                channel:automod.channel,
                                invites:false,
                                rateLimit:automod.rateLimit,
                                massMention:{active:automod.massMention.active,thres:automod.massMention.thres},
                                badWords:{active:automod.badWords.active,list:automod.badWords.list}}}},
                            { new: true }
                        );
                        client.checkEmb('Successfully Disabled the Invites plugin!', message);
                        break;
                    case 'antispam':
                    case 'anti-spam':
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ automod:{
                                active:automod.active,
                                channel:automod.channel,
                                invites:automod.invites,
                                rateLimit:false,
                                massMention:{active:automod.massMention.active,thres:automod.massMention.thres},
                                badWords:{active:automod.badWords.active,list:automod.badWords.list}}}},
                            { new: true }
                        );
                        client.checkEmb('Successfully Disabled the Anti-Spam plugin!', message);
                        break;
                    case 'massmention':
                    case 'mass-mention':
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ automod:{
                                active:automod.active,
                                channel:automod.channel,
                                invites:automod.invites,
                                rateLimit:automod.rateLimit,
                                massMention:{active:false,thres:automod.massMention.thres},
                                badWords:{active:automod.badWords.active,list:automod.badWords.list}}}},
                            { new: true }
                        );
                        client.checkEmb('Successfully Disabled the Mass-Mention plugin!', message);
                        break;
                    case 'badwords':
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ automod:{
                                active:automod.active,
                                channel:automod.channel,
                                invites:automod.invites,
                                rateLimit:automod.rateLimit,
                                massMention:{active:automod.massMention.active,thres:automod.massMention.thres},
                                badWords:{active:false,list:automod.badWords.list}}}},
                            { new: true }
                        );
                        client.checkEmb('Successfully Disabled the BadWords plugin!', message);
                        break;
                    default:
                        client.errEmb(`Unknown Plugin \`${args[1]}\`. See \`help automod\` for subcommands and plugins.`, message);
                        break;
                }
            } else if (args[0] === 'logchannel') {
                if (!args[1]) return client.errEmb('No Option Specified.\n```\nautomod logchannel <Channel:Mention/ID>\nautomod logchannel remove\n```', message);
                if (args[1] === 'remove') {
                    if (!automod.channel) return client.infoEmb('There is no automod log channel setup.', message);
                    await Guild.findOneAndUpdate(
                        { guildID: message.guild.id },
                        { $set:{ automod:{
                            active:automod.active,
                            channel:'',
                            invites:automod.invites,
                            rateLimit:automod.rateLimit,
                            massMention:{active:automod.massMention.active,thres:automod.massMention.thres},
                            badWords:{active:automod.badWords.active,list:automod.badWords.list}}}},
                        { new: true }
                    );
                    client.checkEmb('Successfully Removed Automod log channel!', message);
                } else {
                    const chan = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
                    if (!chan) return client.errEmb('Unknown Channel Specified.', message);
                    if (chan.type != 'text') return client.errEmb('Channel is not a default Text channel.', message);
                    if (!message.guild.member(client.user.id).permissionsIn(chan).has('SEND_MESSAGES')) return client.errEmb('I do not have `SEND MESSAGES` permissions for that channel.', message);
                    await Guild.findOneAndUpdate(
                        { guildID: message.guild.id },
                        { $set:{ automod:{
                            active:automod.active,
                            channel:chan.id,
                            invites:automod.invites,
                            rateLimit:automod.rateLimit,
                            massMention:{active:automod.massMention.active,thres:automod.massMention.thres},
                            badWords:{active:automod.badWords.active,list:automod.badWords.list}}}},
                        { new: true }
                    );
                    client.checkEmb(`Successfully Updated Automod log channel to ${chan}!`, message);
                }
            } else if (args[0] === 'mention-limit') {
                if (!args[1]) return client.errEmb('No Option Specified.\n```\nautomod mention-limit <Number>\nautomod mention-limit reset\n```', message);
                if (args[1] === 'reset') {
                    await Guild.findOneAndUpdate(
                        { guildID: message.guild.id },
                        { $set:{ automod:{
                            active:automod.active,
                            channel:automod.channel,
                            invites:automod.invites,
                            rateLimit:automod.rateLimit,
                            massMention:{active:automod.massMention.active,thres:5},
                            badWords:{active:automod.badWords.active,list:automod.badWords.list}}}},
                        { new: true }
                    );
                    client.checkEmb('Successfully Reset Automod mass-mention threshold!', message);
                } else {
                    const num = parseInt(args[1]);
                    if (isNaN(num)) return client.errEmb('Invalid Integer Specified.', message);
                    await Guild.findOneAndUpdate(
                        { guildID: message.guild.id },
                        { $set:{ automod:{
                            active:automod.active,
                            channel:automod.channel,
                            invites:automod.invites,
                            rateLimit:automod.rateLimit,
                            massMention:{active:automod.massMention.active,thres:num},
                            badWords:{active:automod.badWords.active,list:automod.badWords.list}}}},
                        { new: true }
                    );
                    client.checkEmb(`Successfully Updated Automod mass-mention threshold to ${num}!`, message);
                }
            } else if (args[0] === 'badwords') {
                if (!args[1]) return client.errEmb('No Option Specified.\n```\nautomod badwords list\nautomod badwords add <...words>\nautomod badwords remove <...words>\n```', message);
                let words;
                switch (args[1]) {
                    case 'list':
                        if (!automod.badWords.list.length) return client.infoEmb('There are no badwords saved.', message);
                        const emb = new MessageEmbed()
                        .setTitle('Automod: Badwords List')
                        .setDescription(`Please view this list with discression.\n\`\`\`\n${automod.badWords.list.forEach(i => i).join(', ')}\n\`\`\``)
                        .setColor(0x1e143b)
                        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                        message.channel.send(emb);
                        break;
                    case 'add':
                        if (!args[2]) return client.errEmb('No Words Specified.', message);
                        words = args.splice(2);
                        let current = automod.badWords.list, added = [];
                        added.push(words.filter(w => !current.includes(w)));
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ automod:{
                                active:automod.active,
                                channel:automod.channel,
                                invites:automod.invites,
                                rateLimit:automod.rateLimit,
                                massMention:{active:automod.massMention.active,thres:automod.massMention.thres},
                                badWords:{active:automod.badWords.active,list:added}}}},
                            { new: true }
                        );
                        console.log(added);
                        client.checkEmb(`Successfully added word(s) to Automod badWords list!`, message);
                        break;
                    case 'remove':
                        if (!args[2]) return client.errEmb('No Words Specified.', message);
                        words = args.splice(2);
                        let removed = [];
                        for (let word of words) {
                            if (automod.badWords.list.includes(word)) return;
                            removed.push(word);
                        }
                        if (!removed.length) return client.infoEmb('No changes were made.', message);
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $pullAll:{ automod:{ badWords:{ removed }}}},
                            { new: true }
                        );
                        client.checkEmb(`Successfully removed ${removed.length} word(s) to Automod badWords list!`, message);
                        break;
                        default:
                            client.errEmb(`Unknown Subcommand \`${args[2]}\`. See \`help automod\` for subcommands and plugins.`, message);
                            break;
                }
            } else return client.errEmb(`Unknown Plugin \`${args[0]}\`. See \`help automod\` for subcommands and plugins.`, message);
        }
    }
}
