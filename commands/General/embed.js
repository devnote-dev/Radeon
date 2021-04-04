const { MessageEmbed } = require('discord.js');
const { parseFlags } = require('../../functions/stringParser');

module.exports = {
    name: 'embed',
    tag: 'Creates a custom embed via command flags',
    description: 'Creates a custom embed via command flags.',
    usage: 'embed <...Flags>\n-raw "message\n-author "author message"\n-aicon "author iconURL"\n-thumb "thumbnail URL"\n-title "title message"\n-url "title URL"\n-desc "description message"\n-color "HEX/DECIMAL"\n-image "image URL"\n-footer "footer message"\n-ficon "footer iconURL"\n-ts (timestamp)',
    cooldown: 3,
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No Arguments Provided.\n```\nembed <...Flags>\n```', message);
        const flags = parseFlags(args.join(' '), [
            {name: 'raw', type: 'string'},
            {name: 'author', type: 'string'},
            {name: 'aicon', type: 'string'},
            {name: 'thumb', type: 'string'},
            {name: 'title', type: 'string'},
            {name: 'url', type: 'string'},
            {name: 'desc', type: 'string'},
            {name: 'color', type: 'string'},
            {name: 'image', type: 'string'},
            {name: 'footer', type: 'string'},
            {name: 'ficon', type: 'string'},
            {name: 'ts', type: 'bool'}
        ]);
        const embed = new MessageEmbed();
        let content = '';
        if (flags.length) {
            flags.forEach(flag => {
                if (flag.name == 'raw') content = flag.value;
                if (flag.name == 'author') embed.setAuthor(flag.value, embed.author);
                if (flag.name == 'aicon') embed.setAuthor(embed.author, flag.value);
                if (flag.name == 'thumb') embed.setThumbnail(flag.value);
                if (flag.name == 'title') embed.setTitle(flag.value);
                if (flag.name == 'url') embed.setURL(flfag.value);
                if (flag.name == 'desc') embed.setDescription(flag.value.replace(/\n|\\n/gm, '\n'));
                if (flag.name == 'color') embed.setColor(flag.value);
                if (flag.name == 'image') embed.setImage(flag.value);
                if (flag.name == 'footer') embed.setFooter(flag.value, embed.footer);
                if (flag.name == 'ficon') embed.setFooter(embed.footer, flag.value);
                if (flag.name == 'ts') embed.setTimestamp();
            });
            try {
                return message.channel.send(content, embed);
            } catch (err) {
                return client.errEmb(err.message, message);
            }
        } else {
            return message.channel.send('No flags Provided.');
        }
    }
}