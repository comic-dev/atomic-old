import { Command, CommandMessage, Discord } from "@typeit/discord";
import { Message, MessageEmbed } from "discord.js"
export abstract class PingCommand {
    @Command("ping")
    public static async Ping([message]: [CommandMessage]) {
        let msg: Message = await message.channel.send("Pinging...");
            msg.edit("", { embed: new MessageEmbed({
                title: "Pong!",
                description: `Message Ping: **${msg.createdTimestamp - message.createdTimestamp}** ms\nAPI Ping: **${Math.round(message.client.ws.ping)}** ms`
            }).setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true })).setTimestamp()
        });
    }
}