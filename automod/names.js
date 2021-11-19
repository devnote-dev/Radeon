/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const { clean } = require('./zalgo');

const HOISTED = [
    '!', '&', '#',
    '"', "'", '*',
    '(', '%', ')',
    '+', '-', '/',
    '.'
]

const noop = () => {};

module.exports = async (member, automod) => {
    let cleaned = member.displayName;
    if (automod.names.hoisted) {
        if (HOISTED.some(c => cleaned.startsWith(c))) {
            const expr = new RegExp(HOISTED.join('|'), 'g');
            cleaned = cleaned.replace(expr, '');
        }
    }

    if (automod.names.zalgo) cleaned = clean(cleaned);

    if (!cleaned.length) cleaned = 'pingable username';
    await member.setNickname(cleaned).catch(noop);
}
