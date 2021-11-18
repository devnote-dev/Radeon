/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright 2021 Radeon Development
 */

const { prefix } = require('../config.json');
const { humanize } = require('../util');

const noop = () => {};

module.exports = async (client, message) => {
    if (message.partial) await message.fetch().catch(noop);
    if (!message) return;
    if (message.author.bot) return;

    if (!message.channel) return;
    const { cmd, args } = _parseArgs(message.content, prefix, client.user.id);
    const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (!command) return; // TODO: process automod {}

    if (!message.guild) {
        if (message.channel.partial) await message.channel.fetch().catch(noop);
        if (command.guildOnly) return message.reply('**Error**\nThis command is for servers only.');

        if (type = command.ownerOnly) {
            if (type === 2) return;
            return message.reply('**Error**\nThis command is for bot owners only.');
        }

        if (type = command.modOnly) {
            if (type === 2) return;
            return message.reply('**Error**\nThis command is for bot staff only.');
        }

        if (_runCooldown(client, message, command)) return;

        try {
            await command.run(client, message, args);
        } catch {
            return message.reply(
                '**Error**\nThis command stopped running unexpectedly. '+
                'If you see this error regularly, contact support via the `@Radeon support` command.'
            );
        }
    }

    if (type = command.ownerOnly) {
        if (type === 2) return;
        return message.reply('**Error**\nThis command is for bot owners only.');
    }

    if (type = command.modOnly) {
        if (type === 2) return;
        return message.reply('**Error**\nThis command is for bot staff only.');
    }

    if (_runCooldown(client, message, command)) return;

    let checkInRun = false;
    if (command.perms) {
        if (!command.perms.run) {
            if (err = _checkRunPerms(message.member, command))
                return message.reply(err);
        } else {
            checkInRun = true;
        }
    }

    try {
        await command.run(client, message, args, checkInRun ? _checkRunPerms : null);
    } catch {
        return message.reply(
            '**Error**\nThis command stopped running unexpectedly. '+
            'If you see this error regularly, contact support via the `@Radeon support` command.'
        );
    }
}

function _parseArgs(string, prefix, id) {
    const args = string.trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    if (cmd.startsWith(prefix)) return { cmd, args }
    if (cmd.startsWith('<@')) {
        if (cmd !== `<@${id}>`) return null;
        cmd = args.shift().toLowerCase();
        return { cmd, args }
    }
    return null;
}

function _runCooldown(client, message, command) {
    if (!command.cooldown) return;
    const { author: user } = message;
    if (client.cooldowns.has(user.id)) {
        const US = client.cooldowns.get(user.id);
        if (US.has(command.name)) {
            if (Date.now() > US.get(command.name)) {
                US.set(command.name, Date.now() + (command.cooldown * 1000));
                client.cooldowns.set(user.id, US);
                return;
            } else {
                return message.react('⏳').catch(noop);
            }
        } else {
            US.set(command.name, Date.now() + (command.cooldown * 1000));
            client.cooldowns.set(user.id, US);
            return;
        }
    } else {
        const US = new Map().set(command.name, Date.now() + (command.cooldown * 1000));
        client.cooldowns.set(user.id, US);
        return;
    }
}

function _checkRunPerms(member, cmd) {
    if (member.permissions.has(cmd.perms.bits)) return;
    return `**Error**\nYou are missing ${humanize(cmd.perms.bits)} permissions for this command!`;
}
