import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../Structures/Command";
import { stripIndents } from "common-tags";
export default class PingCommand extends Command {
  public constructor() {
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

  public async exec(message: Message): Promise<void> {
    const msg: Message = await message.util.send("Pinging...");

    await msg.edit("", {
      embed: new MessageEmbed({
        title: "Pong!",
        description: stripIndents`<a:loading:768509189517344788> Message Ping: **${Math.floor(
          msg.createdTimestamp - message.createdTimestamp
        )}** ms
        <a:loading:768509189517344788> API Ping: **${Math.round(
          this.client.ws.ping
        )}** ms`,
      }).setFooter(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      ),
    });
  }
}
