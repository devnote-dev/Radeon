/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const noop = () => {};

class HookManager {
    constructor(client) {
        this.client = client;
        this.queue = new Map();
        this.next = new Map();
        this.running = false;
    }

    add(guild, channel, payload) {
        if (this.queue.has(guild)) {
            const set = this.queue.get(guild);
            set.push({ channel, payload });
            this.queue.set(guild, set);
        } else {
            this.queue.set(guild, [{ channel, payload }]);
        }
        this.next.set(guild, Date.now());
        this.#handle();
    }

    async send(id) {
        const data = this.queue.get(id);
        const hook = await this.getHookFor(id, data.channel);
        if (hook) await hook.send({ embeds: data.payload }).catch(noop);
        this.queue.delete(id);
    }

    async getHookFor(id, chan) {
        const server = client.guilds.cache.get(id);
        const hooks = await server.fetchWebhooks();
        let radeon = hooks.filter(h => h.name === 'Radeon Automod');
        if (!radeon) {
            if (!server.channels.cache.has(chan)) return;
            radeon = await server.channels.cache.get(chan)
                .createWebhook(
                    'Radeon Automod',
                    {
                        avatar: this.client.user.displayAvatarURL(),
                        reason: 'Radeon Automod Logging'
                    }
                );
        }
        return radeon;
    }

    async #handle() {
        if (this.running) return;
        for (const [id, ts] of this.next) {
            if (Date.now() < ts) continue;
            this.send(id);
            this.next.delete(id);
        }
        if (this.next.size) return this.#handle();
        this.running = false;
    }
}

module.exports = HookManager;
