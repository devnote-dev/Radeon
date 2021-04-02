const { Permissions, MessageEmbed } = require('discord.js');
const { isBotStaff, humanize } = require('../../functions/functions');
const { readdirSync } = require('fs');

module.exports = {
    name: 'help',
    aliases: ['h','commands'],
    tag: 'Sends help on a command',
    description: 'Sends help on a command.',
    usage: 'help [Command:Name/Alias]\nhelp [Category]',
    cooldown: 3,
    guildOnly: false,
    run: async (client, message, args) => {
        if (args.length) {
            let valid = false;
            let search = args.join(' ').toLowerCase();
            const embed = new MessageEmbed().setColor(0x1e143b)
            .setFooter('Use "help [Command]" to get info on a specific command.');
            switch (search) {
                case 'admin':
                    search = 'Admin';
                    break;
                case 'general':
                    search = 'General';
                    break;
                case 'main':
                case 'maintenance':
                    search = 'Maintenance';
                    break;
                case 'mod':
                case 'moderation':
                    search = 'Moderation';
                    break;
                case 'ss':
                case 'settings':
                case 'server settings':
                    search = 'Server Settings';
                    break;
            }
            
            let desc = [];
            readdirSync('./commands/').forEach(dir => {
                if (search == dir) {
                    if (dir == 'Admin' && !isBotStaff(message.author.id)) return;
                    embed.setTitle(`Category: ${dir}`);
                    readdirSync(`./commands/${dir}/`).forEach(f => {
                        if (!f.endsWith('.js')) return;
                        const pull = require(`../${dir}/${f}`);
                        desc.push(`**${pull.name}**\n> ${pull.tag || 'No Additional Info.'}\n`);
                    });
                    valid = true;
                }
            });
            embed.setDescription(desc.join('\n'));

            if (valid) return message.channel.send(embed);
            const cmd = client.commands.get(search) || client.commands.get(client.aliases.get(search));
            if (cmd) {
                if (cmd.modOnly && !isBotStaff(message.author.id)) {
                    embed.setTitle('Help Error').setDescription('You don\'t have permission to view this command.');
                    return message.channel.send(embed);
                } else {
                    let [alias, desc, use] = '';
                    if (cmd.aliases) alias = `**Aliases:** \`${cmd.aliases.join('`, `')}\`\n`;
                    if (cmd.description) desc = `**Description:**\n${cmd.description}\n`;
                    if (cmd.usage) use = `**Usage:**\n\`\`\`\n${cmd.usage}\n\`\`\`\n`;
                    let footer = `**Guild Only:** ${cmd.guildOnly ?? 'false'}
                    **User Perms:** \`${cmd.userPerms ? humanize(new Permissions(cmd.userPerms)) : 'None'}\`
                    **Bot Perms:** \`${cmd.botPerms ? humanize(new Permissions(cmd.botPerms)) : 'None'}\``;
                    embed.setTitle(`Command: ${cmd.name}`)
                    .setDescription(alias + desc + use + footer)
                    .setFooter('<> - Required, [] - Optional, a|b - Pick one');
                    return message.channel.send(embed);
                }
            } else {
                if (search.length >= 50) search = search.slice(0,50) + '...';
                embed.setTitle('Help Error').setDescription(`No command or category with the name "${search}"`);
                return message.channel.send(embed);
            }

        } else {
            const embed = new MessageEmbed()
            .setTitle('Radeon Help & Commands')
            .setDescription('Use `help [Command|Category]` for info on a command or group of commands.\n**<>** - Required, **[]** - Optional, **a|b** - Pick one')
            .addFields(
                {name: '<:radeon:813784836228513802> General', value: '`help general`', inline: true},
                {name: '🛠 Maintenance', value: '`help main`', inline: true},
                {name: '<:moderation:813778681914851421> Moderation', value: '`help mod`', inline: true},
                {name: '⚙ Server Settings', value: '`help settings`', inline: true},
                {name: '👮‍♂️ Anti-Raid', value: 'Coming Soon!', inline: true},
                {name: '🔗 Links', value: '[Bot Invite](https://discord.com/api/oauth2/authorize?client_id=762359941121048616&permissions=8&scope=bot) | [Support Server](https://discord.gg/xcZwGhSy4G) | [Github Repo](https://github.com/devnote-dev/Radeon)', inline: false}
            )
            .setColor(0x1e143b);
            return message.channel.send(embed);
        }
    }
}