/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const { parseFlags } = require('../../dist/stringParser');

module.exports = {
    name: 'embed',
    tag: 'Creates a custom embed via command flags',
    description: 'Creates a custom embed via command flags. All flags with arguments require "quotations".',
    usage: 'embed <...Flags>\n-raw "message"\n-author "author message"\n-aicon "author iconURL"\n-thumb "thumbnail URL"\n-title "title message"\n-url "title URL"\n-desc "description message"\n-color "HEX/DECIMAL"\n-image "image URL"\n-footer "footer message"\n-ficon "footer iconURL"\n-ts (timestamp)',
    cooldown: 3,
    guildOnly: true,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No Arguments Provided.\n```\nembed <...Flags>\n```', message);
        const flags = parseFlags(args.join(' '), [
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
        let content = '';
        if (flags.length) {
            let _author, _aicon, _footer, _ficon;
            flags.forEach(flag => {
                if (flag.name === 'raw') content = flag.value;
                if (flag.name === 'author') _author = flag.value;
                if (flag.name === 'aicon') _aicon = flag.value;
                if (flag.name === 'thumb') embed.setThumbnail(flag.value || '');
                if (flag.name === 'title') embed.setTitle(flag.value || '');
                if (flag.name === 'url') embed.setURL(flag.value || '');
                if (flag.name === 'desc') embed.setDescription(flag.value != null ? flag.value.replace(/\n|\\n/gm, '\n') : '\u200b');
                if (flag.name === 'color') embed.setColor(flag.value || '');
                if (flag.name === 'image') embed.setImage(flag.value || '');
                if (flag.name === 'footer') _footer = flag.value;
                if (flag.name === 'ficon') _ficon = flag.value;
                if (flag.name === 'ts') embed.setTimestamp();
            });
            if (_author && _aicon) {
                embed.setAuthor(_author, _aicon);
            } else if (_author && !_aicon) {
                embed.setAuthor(_author);
            } else if (!_author && _aicon) {
                embed.setAuthor('\u200b', _aicon);
            }
            if (_footer && _ficon) {
                embed.setFooter(_footer, _ficon);
            } else if (_author && !_ficon) {
                embed.setFooter(_footer);
            } else if (!_footer && _ficon) {
                embed.setFooter('\u200b', _ficon);
            }
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