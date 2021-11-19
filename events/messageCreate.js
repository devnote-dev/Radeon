/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright 2021 Radeon Development
 */

const log = require('../log');
const { prefix, botOwners, botAdmins } = require('../config.json');
const { humanize } = require('../util');
const { parseAll, parseWithContext } = require('../util/flags');

const noop = () => {};

module.exports = async (client, message) => {
    if (message.partial) await message.fetch().catch(noop);
    if (!message) return;
    if (message.author.bot) return;

    const { cmd, args } = _parseArgs(message.content, prefix, client.user.id);
    if (!cmd) return;
    const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (!command) return; // TODO: process automod {}

    const ctx = {
        length: args.length,
        raw: args,
        lower: args.map(a => a.toLowerCase()),
        upper: args.map(a => a.toUpperCase()),
        flags: null
    }
    if (command.flags) {
        const { short, long } = parseAll(message.content);
        const parsed = parseWithContext([...short, ...long], command.flags);
        ctx.flags = parsed;
    }

    if (!message.guild) {
        if (message.channel.partial) await message.channel.fetch().catch(noop);
        if (!message.channel) return;
        if (command.guildOnly) return message.reply('**Error:** This command is for servers only.');

        if (type = command.ownerOnly) {
            if (!botOwners.includes(message.author.id)) {
                if (type === 2) return;
                return message.reply('**Error:** This command is for bot owners only.');
            }
        }

        if (type = command.modOnly) {
            if (
                !botAdmins.includes(message.author.id) &&
                !botOwners.includes(message.author.id)
            ) {
                if (type === 2) return;
                return message.reply('**Error:** This command is for bot staff only.');
            }
        }

        if (_runCooldown(client, message, command)) return;

        try {
            await command.run(client, message, ctx);
        } catch (err) {
            log.error(err, message, message.author.id);
            return message.reply(
                '**Error:** This command stopped running unexpectedly.\n'+
                'If you see this error regularly, contact support via the `@Radeon support` command.'
            );
        }
    }

    if (type = command.ownerOnly) {
        if (!botOwners.includes(message.author.id)) {
            if (type === 2) return;
            return message.reply('**Error:** This command is for bot owners only.');
        }
    }

    if (type = command.modOnly) {
        if (
            !botAdmins.includes(message.author.id) &&
            !botOwners.includes(message.author.id)
        ) {
            if (type === 2) return;
            return message.reply('**Error:** This command is for bot staff only.');
        }
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
        await command.run(client, message, ctx, checkInRun ? _checkRunPerms : null);
    } catch (err) {
        log.error(err, message, message.author.id);
        return message.reply(
            '**Error:** This command stopped running unexpectedly.\n'+
            'If you see this error regularly, contact support via the `@Radeon support` command.'
        );
    }
}

function _parseArgs(string, prefix, id) {
    const args = string.trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    if (cmd.startsWith(prefix)) return { cmd: cmd.slice(1), args }
    if (cmd.startsWith('<@')) {
        if (cmd !== `<@${id}>`) return { cmd: null }
        cmd = args.shift().toLowerCase();
        return { cmd, args }
    }
    return { cmd: null }
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
    return `**Error:** You are missing ${humanize(cmd.perms.bits)} permissions for this command!`;
}
