import { Command, Listener } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
export default class CommandBlockedListener extends Listener {
  public constructor() {
    super("commandBlocked", {
      event: "commandBlocked",
      emitter: "commandHandler",
      category: "commandHandler",
    });
  }

  public async exec(message: Message, command: Command, reason: string) {
    switch (reason) {
      case "owner":
        message.channel
          .send(
            new MessageEmbed()
              .setTitle("Blocked")
              .setDescription(`The ${command.id} command is owner only.`)
          )
          .then((m) => {
            setTimeout(() => {
              m.delete();
            }, 3000);
          });
        break;
    }
  }
}
