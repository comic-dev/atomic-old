import { Embed } from "../../Structures/Embed";
import { Command } from "../../Structures/Command";
import { Atomic } from "../../Structures/Atomic";
import { Message } from "discord.js";

export default class PingCommand extends Command {
  constructor() {
    super({
      name: "ping",
      aliases: ["p", "pong"],
      timeout: 3000,
      description: "Displays the bot's ping in milliseconds",
    });
  }

  public async run(client: Atomic, message: Message, args: string[]) {
    let msg = await message.channel.send("Pinging...");
    msg.edit("", {
      embed: new Embed(message).setTitle("Pong!").setDescription(`
    <a:loading:768509189517344788> **\\>** Message Ping: **${Math.floor(
      msg.createdTimestamp - message.createdTimestamp
    )}** ms\n<a:loading:768509189517344788> **\\>** API Ping: **${Math.floor(
        client.ws.ping
      )}** ms
  `),
    });
  }
}
