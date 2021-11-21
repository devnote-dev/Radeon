/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

// const char0_9 = [
//     48, 49, 50, 51, 52,
//     53, 54, 55, 56, 57
// ]

// const charA_Z = [
//     65, 66, 67, 68, 69, 70, 71, 72,
//     73, 74, 75, 76, 77, 78, 79, 80,
//     81, 82, 83, 84, 85, 86, 87, 88,
//     89, 90
// ]

// const chara_z = [
//     97,  98,  99, 100, 101, 102,
//     103, 104, 105, 106, 107, 108,
//     109, 110, 111, 112, 113, 114,
//     115, 116, 117, 118, 119, 120,
//     121, 122
// ]

function expose(string) {
    return string
        .replace(/[a-zA-Z0-9\s]+/gmi, '')
        .replace(/[!\s\?\$\^\\\/\*\.\(\)\[\]\{\}#&%$£€@:;|¦"'`^+-¬<>,_]+/g, '');
}

function clean(string) {
    return string
        .replace(/[^a-zA-Z0-9\s]+/gmi, '')
        .replace(/[^!\s\?\$\^\\\/\*\.\(\)\[\]\{\}#&%$£€@:;|¦"'`^+-¬<>,_]+]/g, '');
}

module.exports = {
    expose,
    clean
}
