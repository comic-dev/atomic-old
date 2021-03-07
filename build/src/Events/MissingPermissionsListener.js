"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const Util_1 = require("../Structures/Util");
class MissingPermissionsListener extends discord_akairo_1.Listener {
    constructor() {
        super("missingPermissions", {
            emitter: "commandHandler",
            event: "missingPermissions",
            category: "commandHandler",
        });
    }
    exec(message, command, type, missing) {
        if (type === "client") {
            message.channel
                .send(new discord_js_1.MessageEmbed()
                .setTitle("Command Blocked")
                .setDescription(`The \`${command.id}\` command could not be executed due to the bot missing the **${Util_1.Util.normalize(missing)}** permission(s)`)
                .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp())
                .then((m) => {
                setTimeout(() => {
                    m.delete();
                }, 3000);
            });
        }
        else if (type === "user") {
            message.channel
                .send(new discord_js_1.MessageEmbed()
                .setTitle("Command Blocked")
                .setDescription(`You're missing the **${Util_1.Util.normalize(missing)}** permission(s) which are required to use the \`${command.id}\` command.`)
                .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp())
                .then((m) => {
                setTimeout(() => {
                    m.delete();
                }, 3000);
            });
        }
    }
}
exports.default = MissingPermissionsListener;
