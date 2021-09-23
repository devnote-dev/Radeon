/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { parseFlags } = require('../../dist/stringParser');

const usage = 'embed <...Flags>\n-raw "message"\n-author "author message"\n-aicon "author iconURL"\n-thumb "thumbnail URL"\n-title "title message"\n-url "title URL"\n-desc "description message"\n-color "HEX/DECIMAL"\n-image "image URL"\n-footer "footer message"\n-ficon "footer iconURL"\n-ts (timestamp)';

module.exports = {
    name: 'embed',
    tag: 'Creates a custom embed via command flags',
    description: 'Creates a custom embed via command flags. All flags with arguments require "quotations".',
    usage,
    cooldown: 3,
    guildOnly: true,
    async run(client, message, args) {
        if (!args.length) return client.errEmb(`No Arguments Provided.\n\`\`\`\n${usage}\n\`\`\``, message);
        const flags = parseFlags(args.raw.join(' '), [
            {name: 'raw', type: 'string', quotes: true},
            {name: 'author', type: 'string', quotes: true},
            {name: 'aicon', type: 'string'},
            {name: 'thumb', type: 'string'},
            {name: 'title', type: 'string', quotes: true},
            {name: 'url', type: 'string'},
            {name: 'desc', type: 'string', quotes: true},
            {name: 'color', type: 'string'},
            {name: 'image', type: 'string'},
            {name: 'footer', type: 'string', quotes: true},
            {name: 'ficon', type: 'string'},
            {name: 'ts', type: 'bool'}
        ]);
        const embed = new MessageEmbed();
        let content;
        if (flags.length) {
            let _author, _aicon, _footer, _ficon;
            flags.forEach(flag => {
                if (!flag.value) return;
                let value = typeof flag.value === 'string'
                    ? flag.value
                        .replace(/^"|"$/gm, '')
                        .replace(/\\?\n/gm, '\n')
                    : flag.value;
                if (flag.name === 'raw') content = value;
                if (flag.name === 'author') _author = value;
                if (flag.name === 'aicon') _aicon = value;
                if (flag.name === 'thumb') embed.setThumbnail(value);
                if (flag.name === 'title') embed.setTitle(value);
                if (flag.name === 'url') embed.setURL(value);
                if (flag.name === 'desc') embed.setDescription(value);
                if (flag.name === 'color') embed.setColor(value);
                if (flag.name === 'image') embed.setImage(value);
                if (flag.name === 'footer') _footer = value;
                if (flag.name === 'ficon') _ficon = value;
                if (flag.name === 'ts') embed.setTimestamp();
            });
            if (_author && _aicon) {
                embed.setAuthor(_author, _aicon);
            } else if (_author && !_aicon) {
                embed.setAuthor(_author);
            } else if (!_author && _aicon) {
                embed.setAuthor('\u200b', _aicon);
            }
            if (!embed.description) embed.setDescription('\u200b');
            if (_footer && _ficon) {
                embed.setFooter(_footer, _ficon);
            } else if (_footer && !_ficon) {
                embed.setFooter(_footer);
            } else if (!_footer && _ficon) {
                embed.setFooter('\u200b', _ficon);
            }
            try {
                return await message.channel.send({ content, embeds:[embed] });
            } catch (err) {
                return client.errEmb(err.message, message);
            }
        } else {
            return message.channel.send('No flags Provided.');
        }
    }
}
