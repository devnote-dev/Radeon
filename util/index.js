/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright 2021 Radeon Development
 */

const { Permissions } = require('discord.js');

function humanize(resolvable) {
    let perms = resolvable, res = [];
    if (
        typeof resolvable === 'number' ||
        typeof resolvable === 'bigint'
    ) perms = new Permissions(resolvable);

    perms.toArray().forEach(p => {
        res.push(
            p.split('_')
            .map(w => w[0] + w.toLowerCase())
            .join(' ')
        );
    });

    return res.join(', ');
}

function resolve(entity, type, ctx) {
    if (/\d{17,}/g.test(entity)) entity = entity.replace(/[^\d]+/g, '');

    switch (type) {
        case 'role':
            return ctx.roles.cache.get(entity) ||
                ctx.roles.cache.find(r => r.name.includes(entity))
        case 'channel':
            return ctx.channels.cache.get(entity);
        case 'member':
            return ctx.members.resolve(entity);
    }
}

module.exports = {
    humanize,
    resolve
}
