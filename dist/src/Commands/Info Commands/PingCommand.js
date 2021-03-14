"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../../Structures/Command");
class PingCommand extends Command_1.Command {
    constructor() {
        super("ping", {
            aliases: ["ping", "p", "pong"],
            category: "Information",
            description: {
                content: "Displays the bot's ping in milliseconds",
                usage: "$ping",
                examples: ["$ping"]
            },
            cooldown: 3000
        });
    }
    async exec(message) {
        const msg = await message.util.send("Pinging...");
        await msg.edit("", {
            embed: new discord_js_1.MessageEmbed({
                title: "Pong!",
                description: `<a:loading:768509189517344788> Message Ping: **${Math.floor(msg.createdTimestamp - message.createdTimestamp)}** ms
        <a:loading:768509189517344788> API Ping: **${Math.round(this.client.ws.ping)}** ms`.trim()
            })
                .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor("RANDOM")
        });
    }
}
exports.default = PingCommand;
//# sourceMappingURL=PingCommand.js.map