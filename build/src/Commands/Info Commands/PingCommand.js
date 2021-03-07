"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../../Structures/Command");
const common_tags_1 = require("common-tags");
class PingCommand extends Command_1.Command {
    constructor() {
        super("ping", {
            aliases: ["ping", "p", "pong"],
            category: "Information",
            description: {
                content: "Displays the bot's ping in milliseconds",
                usage: "$ping",
                examples: ["$ping"],
            },
            cooldown: 3000,
        });
    }
    async exec(message) {
        message.util.send(message.guild.emojis.cache.map((g) => `\\${g.toString()}`));
        const msg = await message.util.send("Pinging...");
        await msg.edit("", {
            embed: new discord_js_1.MessageEmbed({
                title: "Pong!",
                description: common_tags_1.stripIndents `<a:loading:768509189517344788> Message Ping: **${Math.floor(msg.createdTimestamp - message.createdTimestamp)}** ms
        <a:loading:768509189517344788> API Ping: **${Math.round(this.client.ws.ping)}** ms`,
            }).setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true })),
        });
    }
}
exports.default = PingCommand;
