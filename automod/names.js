/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const HOISTED = [
    '!', '&', '#',
    '"', "'", '*',
    '(', '%', ')',
    '+', '-', '/',
    '.'
]

const noop = () => {};

module.exports = async (member, automod) => {
    if (HOISTED.some(c => member.displayName.startsWith(c))) {
        const expr = new RegExp(HOISTED.join('|'), 'g');
        let cleaned = member.displayName.replace(expr, '');
        if (!cleaned.length) cleaned = 'hoisted';
        return await member.setName(cleaned).catch(noop);
    }

    let cleaned = member.displayName;
    if (automod.names.hoisted) {
        if (HOISTED.some(c => cleaned.startsWith(c))) {
            const expr = new RegExp(HOISTED.join('|'), 'g');
            let cleaned = member.displayName.replace(expr, '');
        }
    }

    if (automod.names.zalgo) {} // TODO: use ZalgoManager

    if (!cleaned.length) cleaned = 'pingable username';
    await member.setNickname(cleaned).catch(noop);
}
