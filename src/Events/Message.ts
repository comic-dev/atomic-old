import { Atomic } from "../Structures/Atomic";
import { Command, Run } from "../Interfaces/ClientInterfaces";
import { Embed } from "../Structures/Embed";
import { BitFieldResolvable, Message, PermissionFlags, PermissionString } from "discord.js";
export const name: string = "message";
export const run: Run = async (client: Atomic, message: Message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.toLowerCase().startsWith(client.prefix)) return;

  let [cmd, ...args]: string[] = message.content
    .slice(client.prefix.length)
    .trim()
    .split(/ +/g);
  cmd = cmd.toLowerCase();

  let Command: Command = client.commands.has(cmd)
    ? client.commands.get(cmd)
    : client.aliases.get(cmd);
  if (Command) {
    if (Command.timeout || 3000) {
      if (client.cooldowns.has(`${message.author.id}${Command.name}`)) {
        message.delete();
        let cd = client.cooldowns.get(`${message.author.id}${Command.name}`);
        let now = Date.now();
        if (now < cd) {
          const left = cd - now;
          message.channel
            .send(
              new Embed(message, {
                title: "Slow Down!",
                description: `You are on cooldown for **${(left / 1000).toFixed(
                  1
                )}** more second(s)`,
              })
            )
            .then((msg) => {
              msg.delete({ timeout: left });
            });
          return setTimeout(() => {
            client.cooldowns.delete(`${message.author.id}${Command.name}`);
          }, left);
        }
      } else {
        Command.run(client, message, args);
        return client.cooldowns.set(
          `${message.author.id}${Command.name}`,
          Date.now() + (Command.timeout || 3000)
        );
      }
    }

    Command.run(client, message, args);
  }
};
