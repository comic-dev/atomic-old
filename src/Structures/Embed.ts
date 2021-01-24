import {
  Message,
  MessageEmbed,
  MessageEmbedOptions as EmbedOptions,
} from "discord.js";
export class Embed extends MessageEmbed {
  constructor(message?: Message, data?: EmbedOptions) {
    super({
      ...data,
    });
    message
      ? this.setFooter(
          message.author.username,
          message.author.displayAvatarURL({ dynamic: true })
        ).setTimestamp()
      : this;
  }
}
