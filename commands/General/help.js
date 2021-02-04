const {MessageEmbed} = require('discord.js');
const {readdirSync} = require('fs');

module.exports = {
    name: 'help',
    aliases: ['h','commands'],
    description: 'Sends help on a command.',
    usage: 'help [command name/alias]',
    guildOnly: false,
    run: async (client, message, args) => {
        if (args.length > 0) {
            const search = args.join(' ').toLowerCase();
            let cmd = client.commands.get(search) || client.commands.get(client.aliases.get(search));
            if (!cmd) return message.channel.send({embed:{description:`Could not find the command \`${args.join(' ')}\``,color:0x750000}});
            if (cmd.modOnly && !client.config.botOwners.includes(message.author.id)) return message.channel.send({embed:{title:'Help Error',description:'You do not have permission to view this command.',color:0x750000}});
            const embed = new MessageEmbed().setTitle('Command: '+ cmd.name).setColor(0x1e143b);
            let alias = '', desc = '', usage = '';
            if (cmd.aliases) alias = `**Aliases:** \`${cmd.aliases.join('`, `')}\``;
            if (cmd.description) desc = `\n**Description:** ${cmd.description}`;
            if (cmd.usage) usage = `\n**Usage:**\n\`\`\`\n${cmd.usage}\n\`\`\``;
            let go = `\n**Guild Only:** ${cmd.guildOnly}\n**Required Perms:** \`${cmd.permissions ? cmd.permissions.join(' ').toLowerCase() : 'None'}\``;
            embed.setDescription(alias + desc + usage + go);
            message.channel.send(embed);
        } else {
            const embed = new MessageEmbed()
            .setTitle('Radeon Help/Commands')
            .setDescription('Use `help [command name/alias]` for info on a specific command.\nKey: **<>** - required, **[]** - optional')
            .setColor(0x1e143b);
            let commands = [];
            readdirSync('./commands/').forEach(dir => {
                if (dir === 'Admin') return;
                readdirSync(`./commands/${dir}/`).forEach(cmd => {
                    commands.push(cmd.split('.').shift());
                });
                embed.addField(dir, `\`${commands.join('`, `')}\``, false);
                commands = [];
            });
            embed.addField('🔗 Links', '[Bot Invite](https://discord.com/api/oauth2/authorize?client_id=762359941121048616&permissions=8&scope=bot) | [Support Server](https://discord.gg/xcZwGhSy4G)', false);
            message.channel.send(embed);
        }
    }
}
