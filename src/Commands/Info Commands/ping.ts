import { Atomic } from "../../Structures/Atomic";
import { Run } from "../../Interfaces/ClientInterfaces";
import { Message } from "discord.js";
import { Embed } from "../../Structures/Embed";

export const name: string = "ping";
export const aliases: string[] = ["pong", "p"];
export const description: string = "Displays the bot's ping in milliseconds";
export const timeout: number = 3000;
export const user = {
  permissions: ["MANAGE_MESSAGES"],
};
export const run: Run = async (
  client: Atomic,
  message: Message,
  args: string[]
): Promise<any> => {
  let msg = await message.channel.send("Pinging...");
  msg.edit("", {
    embed: new Embed(message).setTitle("Pong!").setDescription(`
    <a:loading:768509189517344788> **\\>** Message Ping: **${Math.floor(
      msg.createdTimestamp - message.createdTimestamp
    )}** ms
    <a:loading:768509189517344788> **\\>** API Ping: **${Math.floor(
      client.ws.ping
    )}** ms
  `),
  });
};
