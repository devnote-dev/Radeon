require('discord.js');
const { logAdmin } = require('../../console/consoleR');

module.exports = {
    name: 'reload',
    aliases: ['rl'],
    description: 'Reloads a command into the client',
    usage: 'reload <Category> <Command>',
    guildOnly: true,
    modOnly: 1,
    run: async (client, message, args) => {
        if (args.length < 2) return client.errEmb('Insufficient Arguments\n```\nreload <Category> <Command>\n```', message);
        const cat = args[0].toLowerCase();
        const cmd = client.commands.get(args[1].toLowerCase()) || client.commands.get(client.aliases.get(args[1].toLowerCase()));
        switch (cat) {
            case 'a':
            case 'admin':
                category = 'Admin';
                break;
            case 'g':
            case 'general':
                category = 'General';
                break;
            case 'ma':
            case 'main':
            case 'maintenance':
                category = 'Maintenance';
                break;
            case 'mo':
            case 'mod':
            case 'moderation':
                category = 'Moderation';
                break;
            case 'ss':
            case 'settings':
                category = 'Server Settings';
                break;
            case 'f':
            case 'fun':
                category = 'Fun'
                break;
            default:
                category = undefined;
                break;
        }
        if (!category) return client.errEmb('Unknown Command Category Specified.', message);
        if (!cmd) return client.errEmb('Unknown Command Specified.', message);
        const path = `${message.guild.id}/${message.channel.id}`;
        logAdmin('reload', path, message.author.id, cmd.name);
        try {
            delete require.cache[require.resolve(`../${category}/${cmd.name}.js`)];
            client.commands.delete(cmd);
            const pull = require(`../${category}/${cmd.name}.js`);
            client.commands.set(pull.name, pull);
            return client.checkEmb(`Successfully Reloaded Command \`${pull.name}\`!`, message);
        } catch (err) {
            console.error(err);
            return client.errEmb('Failed Reloading Command. Error logged on console.', message);
        }
    }
}