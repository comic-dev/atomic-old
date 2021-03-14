"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class CooldownListener extends discord_akairo_1.Listener {
    constructor() {
        super("cooldown", {
            event: "cooldown",
            emitter: "commandHandler",
            category: "commandHandler",
        });
    }
    async exec(message, command, left) {
        message.channel
            .send(new discord_js_1.MessageEmbed()
            .setTitle("Cooldown")
            .setDescription(`You're on a cooldown for **${(left / 1000).toFixed(1)}** more seconds.`)
            .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp())
            .then((m) => {
            setTimeout(() => {
                m.delete();
            }, left);
        });
    }
}
exports.default = CooldownListener;
//# sourceMappingURL=CooldownListener.js.map