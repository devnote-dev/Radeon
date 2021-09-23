/**
 * Radeon Functions Index.
 * @author Devonte <https://github.com/devnote-dev>
 * @author Crenshaw <https://github.com/Crenshaw1312>
 * @copyright Radeon Development 2021
 */

const { botOwners, botAdmins } = require('../../config.json');
const {
    Message,
    GuildMember,
    Permissions,
    PermissionResolvable,
    Role,
    GuildChannel,
    Collection
} = require('discord.js');

/**
 * Converts a timestamp to a small humanized duration.
 * @param {number} ms Milliseconds to convert from.
 * @returns {string}
 */
function toDurationDefault(ms) {
    ms = Date.now() - ms;
    const secs = Math.floor(ms / 1000) % 24;
    const mins = Math.floor(ms / 60000) % 60;
    const hours = Math.floor(ms / 3600000) % 24;
    const days = Math.floor(ms / 86400000);
    return `${days > 0 ? days +' days ' : ''}${hours} hours ${mins} minutes and ${secs} seconds ago`;
}

/**
 * Converts a timestamp to a long humanized duration.
 * @param {number} ms Milliseconds to convert from.
 * @returns {string}
 */
function toDurationLong(ms) {
    ms = Date.now() - ms;
    const hours = Math.floor(ms / 3600000) % 24;
    const days = Math.floor(ms / 86400000);
    const weeks = Math.floor(ms / 6.048e+8);
    const month = Math.floor(ms / 2.628e+9);
    const years = Math.floor(ms / 3.154e+10);
    return `${years > 0 ? years +' years ' : ''}${month > 0 ? month +' months ' : ''}${weeks > 0 ? weeks +' weeks ' : ''}${days} days and ${hours} hours ago`;
}

/**
 * Converts a timestamp to a days string.
 * @param {number} ms Milliseconds to convert from.
 * @returns {string}
 */
function toDurationDays(ms) {
    const days = (Date.now() - ms) / 86400000;
    return `${days} days ago`;
}

function isBotStaff(id) {
    return botOwners.includes(id) || botAdmins.includes(id);
}

function isBotOwner(id) { return botOwners.includes(id) }

/**
 * Humanizes a Discord.Permissions bitfield to readable strings.
 * @param {PermissionResolvable} permissions Permissions to convert.
 * @returns {string[]}
 */
function humanize(permissions) {
    const perms = [];
    permissions = new Permissions(permissions);
    permissions.toArray().forEach(p => {
        let r = '';
        p.replace(/_/g, ' ').split(' ').forEach(w => {
            r += w.split('')[0] + w.slice(1).toLowerCase() + ' ';
        });
        perms.push(r.trim());
    });
    return perms;
}

/**
 * @param {string[]} args args in the message
 * @param {?object} options what you want to find
 * @param {?string} not what the option cannot be 
 * @returns {string}
 */
function choose(args, options, not) {
    let choice = options[Math.floor(Math.random() * options.length)];
    if (!args)
        return choice;
    for (let option of options) {
        if (args.find(arg => option == arg && not !== arg))
            choice = option;
    }
    return choice;
}

/**
 * Resolves a role from a name, ID, or object.
 * @param {string|Message|GuildMember} ctx The context to resolve from.
 * @param {string[]} args Arguments to resolve from.
 * @returns {?Role|Collection<string, Role>}
 */
function resolveRole(ctx, args) {
    args = args.join(' ').toLowerCase();
    if (ctx instanceof Message || ctx instanceof GuildMember) ctx = ctx.guild;

    let role = ctx.roles.resolve(args);
    if (role) return role;
    role = ctx.roles.cache.filter(r => r.name.toLowerCase().includes(args));
    return role.size > 1 ? role : role.first();
}

/**
 * Resolves a member from a name, nickname, ID, or object.
 * @param {string|Message|GuildMember} ctx The context to resolve from.
 * @param {string[]} args Arguments to resolve from.
 * @returns {Promise<GuildMember | void>}
 */
async function resolveMember(ctx, args) {
    args = args.join(' ');
    if (ctx instanceof Message || ctx instanceof GuildMember) ctx = ctx.guild;

    let member = ctx.members.resolve(args);
    if (member) return Promise.resolve(member);
    member = await ctx.members.search({ query: args });
    if (member) return member.size > 1 ? member : member.first();
    member = await ctx.members.fetch(member).catch(()=>{});
    return member instanceof Collection && member.size === 1
        ? member.first()
        : member
}

/**
 * Resolves a channel from a name, ID, or object.
 * @param {string|Message} ctx The context to resolve from.
 * @param {string[]} args Arguments to resolve from.
 * @returns {?GuildChannel}
 */
function resolveChannel(ctx, args) {
    args = args.join('-').toLowerCase();
    if (ctx instanceof Message) ctx = ctx.guild;

    const chan = ctx.channels.resolve(args);
    if (chan) return chan;
    return ctx.channels.cache.filter(r => r.name.includes(args));
}

module.exports = {
    toDurationDefault,
    toDurationLong,
    toDurationDays,
    isBotStaff,
    isBotOwner,
    humanize,
    choose,
    resolveRole,
    resolveMember,
    resolveChannel
}
