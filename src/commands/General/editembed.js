/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

module.exports = {
    name: 'editembed',
    aliases: ['editemb'],
    tag: 'Edits an existing embed using JSON',
    description: 'Edits an existing embed sent by Radeon using JSON string.',
    usage: 'editembed <Message:ID> <JSON:Text> [-o :Flag]',
    cooldown: 3,
    userPerms: 8192n,
    botPerms: 24576n,
    guildOnly: true,
    options:[
        {
            name: 'message',
            type: 'STRING',
            description: 'The ID of the message to edit.',
            required: true
        },
        {
            name: 'json',
            type: 'STRING',
            description: 'The json to update the message with.',
            required: true
        },
        {
            name: 'overwrite',
            type: 'BOOLEAN',
            description: 'whether to overwrite existing values.',
            required: true
        }
    ],

    async run(client, message, args) {
        if (args.length < 2) return client.error('Insufficient Arguments Specified.\n```\neditembed <Message:ID> <JSON:Text>\n```', message);
        const msg = message.channel.messages.cache.get(args.raw[0]);
        if (!msg) return client.error('Invalid Message.\nEither the message ID provided was invalid or the message is not in the bot\'s cache.', message);
        if (msg.author.id !== client.user.id) return client.error('Message was not sent by this bot.', message);
        try {
            const embeds = JSON.parse(args.raw.slice(1).join(' '));
            await msg.edit({ embeds:[embeds] });
            await message.react(':checkgreen:796925441771438080').catch(()=>{});
        } catch (err) {
            return client.error(err.message, message);
        }
    },

    async slash(client, { message, options }) {
        const id = options.get('message')?.value;
        const json = options.get('json')?.value;
        const flag = options.get('overwrite')?.value;
        const args = { raw:[id, json] }
        if (flag) args.raw.push('-o');
        await this.run(client, message, args);
    }
}
