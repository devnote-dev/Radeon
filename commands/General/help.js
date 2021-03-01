const {Permissions, MessageEmbed} = require('discord.js');
const {readdirSync} = require('fs');

module.exports = {
    name: 'help',
    aliases: ['h','commands'],
    description: 'Sends help on a command.',
    usage: 'help [Command:Name/Alias]\nhelp [Category]',
    cooldown: 3,
    guildOnly: false,
    run: async (client, message, args) => {
        if (args.length) {
            let valid = false;
            let search = args.join(' ').toLowerCase();
            const embed = new MessageEmbed().setColor(0x1e143b);
            switch (search) {
                case 'general':
                    search = 'general';
                    break;
                case 'main':
                case 'maintenance':
                    search = 'maintenance';
                    break;
                case 'mod':
                case 'moderation':
                    search = 'moderation';
                    break;
                case 'ss':
                case 'settings':
                case 'server settings':
                    search = 'server settings';
                    break;
            }
            readdirSync('./commands/').forEach(dir => {
                if (dir === 'Admin') return;
                if (search === dir.toLowerCase()) {
                    embed.setTitle(`Category: ${dir}`);
                    let desc = [];
                    readdirSync(`./commands/${dir}/`).forEach(f => desc.push(f.split('.').shift()));
                    embed.setDescription(`\`${desc.join('`, `')}\``).setFooter('Use "help [Command]" to get info on a specific command.');
                    valid = true;
                }
            });
            if (valid) return message.channel.send(embed);
            const cmd = client.commands.get(search) || client.commands.get(client.aliases.get(search));
            if (cmd) {
                if (cmd.modOnly && !client.config.botOwners.includes(message.author.id)) {
                    return message.channel.send({embed:{title:'Help Error',description:'You do not have permission to view this command.',color:0x1e143b}});
                } else {
                    let alias = '', desc = '', use = '';
                    if (cmd.aliases) alias = `**Aliases:** \`${cmd.aliases.join('`, `')}\`\n\n`;
                    if (cmd.description) desc = `**Description:** ${cmd.description}\n\n`;
                    if (cmd.usage) use = `**Usage:**\n\`\`\`\n${cmd.usage}\n\`\`\`\n`;
                    let go = `**Guild-Only:** \`${cmd.guildOnly}\`\n**Required Perms:** \`${cmd.permissions ? (new Permissions(cmd.permissions)).toArray().join('`, `') : 'None'}\``;
                    embed.setTitle(`Command: ${cmd.name}`)
                    .setDescription(alias+desc+use+go)
                    .setFooter('<> - Required, [] - Optional, a|b - Pick one');
                    return message.channel.send(embed);
                }
            } else {
                return message.channel.send({embed:{title:'Help Error',description:`No command or category with the name "${search}"`,color:0x1e143b}});
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
                {name: '🔗 Links', value: '[Bot Invite](https://discord.com/api/oauth2/authorize?client_id=762359941121048616&permissions=8&scope=bot) | [Support Server](https://discord.gg/xcZwGhSy4G)', inline: false}
            )
            .setColor(0x1e143b);
            message.channel.send(embed);
        }
    }
}
