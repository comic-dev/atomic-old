"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class CommandBlockedListener extends discord_akairo_1.Listener {
    constructor() {
        super("commandBlocked", {
            event: "commandBlocked",
            emitter: "commandHandler",
            category: "commandHandler"
        });
    }
    async exec(message, command, reason) {
        switch (reason) {
            case "owner":
                message.channel
                    .send(new discord_js_1.MessageEmbed()
                    .setTitle("Blocked")
                    .setDescription(`The ${command.id} command is owner only.`))
                    .then((m) => {
                    setTimeout(() => {
                        m.delete();
                    }, 3000);
                });
                break;
            default:
                break;
        }
    }
}
exports.default = CommandBlockedListener;
//# sourceMappingURL=CommandBlockedListener.js.map