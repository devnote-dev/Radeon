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

module.exports = {
    humanize
}
