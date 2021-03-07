"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_tags_1 = require("common-tags");
const discord_akairo_1 = require("discord-akairo");
const Command_1 = require("../../Structures/Command");
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
class HelpCommand extends Command_1.Command {
    constructor() {
        super("help", {
            aliases: ["help", "h"],
            description: {
                content: "Sends the interactive help menu for Atomic",
                usage: "$help [command]",
                examples: ["$help", "$help p", "$help ping"],
            },
            category: "Information",
            cooldown: 3000,
            clientPermissions: ["ADD_REACTIONS"],
            args: [
                {
                    id: "command",
                    type: discord_akairo_1.Argument.union("command", "commandAlias"),
                    default: null,
                    match: "content",
                },
            ],
        });
    }
    async exec(message, { command }) {
        let SearchCollector;
        const prefix = await this.handler.prefix(message);
        if (!command || command === null) {
            const Home = new discord_js_1.MessageEmbed()
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
                .setColor("RANDOM")
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
            const Commands = new discord_js_1.MessageEmbed()
                .setTitle("Atomic Help | Commands")
                .setDescription(`View all commands and their categories below\nFor further info about a specific command, use \`${prefix}help <Command>\``)
                .setColor("RANDOM");
            this.handler.categories.each((c, s) => {
                Commands.addField(`❯ ${s} [${c.size}]`, `\`${c.map((c) => c.id).join("`, `")}\``);
            });
            const Search = new discord_js_1.MessageEmbed()
                .setTitle("Atomic Help | Search")
                .setDescription("Find commands or aliases by typing a query")
                .setColor("RANDOM");
            const Customs = new discord_js_1.MessageEmbed()
                .setTitle("Under Construction")
                .setDescription("This feature is currently still being developed.")
                .setColor("RANDOM");
            const msg = await message.util.send(Home);
            try {
                await msg.react("🏠");
                await msg.react("📚");
                await msg.react("🔎");
                await msg.react("🔧");
            }
            catch (er) {
                console.log(er);
            }
            const collector = msg.createReactionCollector((r, u) => {
                return ["🏠", "📚", "🔎", "🔧"].includes(r.emoji.name) && !u.bot;
            }, { time: 3e5 });
            collector.on("collect", async (r, u) => {
                if (u.bot)
                    return;
                if (!["🏠", "📚", "🔎", "🔧"].includes(r.emoji.name))
                    return;
                r.users.remove(u.id);
                switch (r.emoji.name) {
                    case "🏠":
                        msg.edit(Home);
                        if (SearchCollector?.client)
                            SearchCollector.stop();
                        break;
                    case "📚":
                        msg.edit(Commands);
                        if (SearchCollector?.client)
                            SearchCollector.stop();
                        break;
                    case "🔎":
                        msg.edit(Search);
                        SearchCollector = msg.channel.createMessageCollector((m, u) => {
                            return !m.author.bot && !u.bot && u.id === message.author.id;
                        }, { time: 3e5 });
                        SearchCollector.on("collect", (m) => {
                            if (m.content.toLowerCase() === "cancel") {
                                message.channel.send(new discord_js_1.MessageEmbed().setTitle("Cancelling").setColor("RANDOM"));
                                SearchCollector.stop();
                                return msg.edit(Home);
                            }
                            let res = this.handler.modules.filter((c) => {
                                return (c.id
                                    .toLowerCase()
                                    .match(new RegExp(m.content.toLowerCase(), "g"))?.length >
                                    0);
                            }) ||
                                this.handler.modules.filter((c) => {
                                    return c.aliases.some((v) => {
                                        return (v
                                            .toLowerCase()
                                            .match(new RegExp(m.content.toLowerCase(), "g"))
                                            ?.length > 0);
                                    });
                                });
                            const Result = new discord_js_1.MessageEmbed()
                                .setTitle("Search Results")
                                .setColor("RANDOM");
                            if (!res.first()) {
                                Result.setDescription("No commands or aliases have been found");
                                SearchCollector.stop();
                                msg.edit(Result);
                                return m.delete();
                            }
                            if (Object.keys(res.first())?.includes("category")) {
                                Result.setDescription("Found an Command");
                                Result.addField(res.first().id, common_tags_1.stripIndents `
                **\\>** Name: ${res.first().id}
                **\\>** Aliases: ${res.first().aliases.join("**, **")}
                **\\>** Category: ${res.first().categoryID}
                **\\>** Description: ${res.first().description.content}
                **\\>** Cooldown: ${ms_1.default(res.first().cooldown ?? this.handler.defaultCooldown, {
                                    long: true,
                                })}
                **\\>** Usage: ${res.first().description.usage}
                **\\>** Examples: \n${res
                                    .first()
                                    .description.examples.join("\n")}
                ${res.first().ownerOnly ? "**Developer Only!**" : ""}`).setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
                            }
                            msg.edit(Result);
                        });
                        break;
                    case "🔧":
                        if (SearchCollector?.client)
                            SearchCollector.stop();
                        msg.edit(Customs);
                        break;
                }
            });
        }
        else {
            let Embed = new discord_js_1.MessageEmbed()
                .setTitle("Atomic Help | Command Result")
                .addField(command.id, common_tags_1.stripIndents `
      **\\>** Name: ${command.id}
      **\\>** Aliases: ${command.aliases.join("**, **")}
      **\\>** Category: ${command.categoryID}
      **\\>** Description: ${command.description.content}
      **\\>** Cooldown: ${ms_1.default(command.cooldown ?? this.handler.defaultCooldown, {
                long: true,
            })}
      **\\>** Examples: \n${command.description.examples.join("\n")}
      ${command.ownerOnly ? "**Developer Only!**" : ""}`)
                .setColor("RANDOM")
                .setFooter(`Requested by: ${message.author.tag}`)
                .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
            message.channel.send(Embed);
        }
    }
}
exports.default = HelpCommand;
