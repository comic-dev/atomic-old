import { Command } from "discord-akairo";
import { Message, MessageEmbed, Collection } from "discord.js";
import { stripIndents } from "common-tags";
export default class PingCommand extends Command {
  public constructor() {
    super("Ping", {
      description: "Displays the bot's ping in milliseconds",
      aliases: ["ping", "p", "pong"],
      category: "Information",
      cooldown: 3e3,
    });
  }

  public async exec(message: Message): Promise<void> {
    const msg: Message = await message.util.send("Pinging...");

    await msg.edit("", {
      embed: new MessageEmbed({
        title: "Pong!",
        description: stripIndents`Message Ping: **${Math.floor(
          msg.createdTimestamp - message.createdTimestamp
        )}** ms
        API Ping: **${Math.round(this.client.ws.ping)}** ms`,
      }).setFooter(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      ),
    });
  }
}
