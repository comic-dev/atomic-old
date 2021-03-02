import { stripIndents } from "common-tags";
import { Category, PrefixSupplier, Command, Argument } from "discord-akairo";
import {
  Message,
  MessageEmbed,
  MessageCollector,
  ReactionCollector,
  MessageReaction,
  User,
} from "discord.js";
import ms from "ms";
export default class HelpCommand extends Command {
  public constructor() {
    super("Help", {
      aliases: ["help", "h"],
      description: "Returns the Atomic help menu",
      args: [
        {
          id: "command",
          type: Argument.union("command", "commandAlias"),
          default: null,
          match: "restContent",
        },
      ],
      category: "Info",
      cooldown: 3e3,
      clientPermissions: ["ADD_REACTIONS"],
    });
  }

  public async exec(
    message: Message,
    { command }: { command: Command | null }
  ): Promise<any> {
    let SearchCollector: MessageCollector;
    const prefix = await (this.handler.prefix as PrefixSupplier)(message);
    if (!command || command === null) {
      const Home: MessageEmbed = new MessageEmbed()
        .setTitle("Atomic Help | Home")
        .addFields([
          {
            name: "🏠 | Home",
            value: "Returns to this page",
          },
          {
            name: "📚 | Commands",
            value: "Shows all categories along with their commands",
          },
          {
            name: "🔎 | Search",
            value: "Search for any command or alias",
          },
          {
            name: "🔧 | Customs",
            value: "Show all custom commands for this guild",
          },
        ])
        .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
        .setFooter(
          `Requested by ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp();

      const Commands: MessageEmbed = new MessageEmbed()
        .setTitle("Atomic Help | Commands")
        .setDescription(
          `View all commands and their categories below\nFor further info about a specific command, use \`${prefix}help <Command>\``
        );
      this.handler.categories.each(
        (c: Category<string, Command>, s: string) => {
          Commands.addField(
            `${s} [${c.size}]`,
            `\`${c.map((c) => c.id).join("`, `")}\``
          );
        }
      );

      const Search: MessageEmbed = new MessageEmbed()
        .setTitle("Atomic Help | Search")
        .setDescription("Find commands or aliases by typing a query");

      const Customs: MessageEmbed = new MessageEmbed()
        .setTitle("Under Construction")
        .setDescription("This feature is currently still being developed.");

      const msg: Message = await message.util.send(Home);
      try {
        await msg.react("🏠");
        await msg.react("📚");
        await msg.react("🔎");
        await msg.react("🔧");
      } catch (er) {
        console.log(er);
      }

      const collector: ReactionCollector = msg.createReactionCollector(
        (r: MessageReaction, u: User) => {
          return ["🏠", "📚", "🔎", "🔧"].includes(r.emoji.name) && !u.bot;
        },
        { time: 3e5 }
      );

      collector.on("collect", async (r: MessageReaction, u: User) => {
        if (u.bot) return;
        if (!["🏠", "📚", "🔎", "🔧"].includes(r.emoji.name)) return;
        r.users.remove(u.id);
        switch (r.emoji.name) {
          case "🏠":
            msg.edit(Home);
            if (SearchCollector?.client) SearchCollector.stop();
            break;

          case "📚":
            msg.edit(Commands);
            if (SearchCollector?.client) SearchCollector.stop();
            break;
          case "🔎":
            msg.edit(Search);
            SearchCollector = msg.channel.createMessageCollector(
              (m: Message, u: User) => {
                return !m.author.bot && !u.bot;
              },
              { time: 3e5 }
            );
            SearchCollector.on("collect", (m: Message) => {
              let res: any =
                this.handler.modules.filter((c) => {
                  return (
                    c.id
                      .toLowerCase()
                      .match(new RegExp(m.content.toLowerCase(), "g"))?.length >
                    0
                  );
                }) &&
                this.handler.modules.filter((c) => {
                  return c.aliases.some((v) => {
                    return (
                      v
                        .toLowerCase()
                        .match(new RegExp(m.content.toLowerCase(), "g"))
                        ?.length > 0
                    );
                  });
                });

              const Result: MessageEmbed = new MessageEmbed().setTitle(
                "Search Results"
              );
              if (!res.first()) {
                Result.setDescription("No commands or aliases have been found");
                SearchCollector.stop();
                msg.edit(Result);
                return m.delete();
              }
              if (Object.keys(res.first())?.includes("category")) {
                Result.setDescription("Found an Command");
                Result.addField(
                  res.first().id,
                  stripIndents`
                **\\>** Name: **${res.first().id}**
                **\\>** Aliases: **${res.first().aliases.join("**, **")}**
                **\\>** Cooldown: **${ms(
                  res.first().cooldown ?? this.handler.defaultCooldown,
                  {
                    long: true,
                  }
                )}**
                **\\>** Description: **${res.first().description}**
                ${res.first().ownerOnly ? "**Developer Only!**" : ""}`
                ).setThumbnail(
                  message.author.displayAvatarURL({ dynamic: true })
                );
              }
              msg.edit(Result);
            });
            break;

          case "🔧":
            if (SearchCollector?.client) SearchCollector.stop();
            msg.edit(Customs);
            break;
        }
      });
    } else {
      let Embed: MessageEmbed = new MessageEmbed()
        .setTitle("Atomic Help | Command Result")
        .addField(
          command.id,
          stripIndents`
      **\\>** Name: **${command.id}**
      **\\>** Aliases: **${command.aliases.join("**, **")}**
      **\\>** Cooldown: **${ms(
        command.cooldown ?? this.handler.defaultCooldown,
        { long: true }
      )}**
      **\\>** Description: **${command.description}**
      ${command.ownerOnly ? "**Developer Only!**" : ""}`
        )
        .setFooter(`Requested by: ${message.author.tag}`)
        .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
      message.channel.send(Embed);
    }
  }
}
