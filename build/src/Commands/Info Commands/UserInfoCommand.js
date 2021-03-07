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
const Util_1 = require("../../Structures/Util");
class UserInfoCommand extends Command_1.Command {
    constructor() {
        super("userinfo", {
            aliases: ["userinfo", "ui", "user", "u"],
            description: {
                content: "Shows specific information about an guild member",
                usage: "$userinfo [ member ]",
                examples: ["$userinfo comic.#6949", "$userinfo 589390599740719105"],
            },
            category: "Information",
            cooldown: 3000,
            args: [
                {
                    id: "member",
                    match: "content",
                    type: discord_akairo_1.Argument.union("member", "relevant"),
                    default: (msg) => {
                        return msg.member;
                    },
                },
            ],
        });
    }
    async exec(message, { member }) {
        if (!member?.id)
            member = message.member;
        const { username, tag, createdAt, createdTimestamp, discriminator, bot, flags, id, presence, } = member.user;
        const { roles, permissions, joinedAt, joinedTimestamp, premiumSince, premiumSinceTimestamp, displayHexColor, displayName, } = member;
        let Info = new discord_js_1.MessageEmbed()
            .setTitle(`Info for ${username}`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(displayHexColor)
            .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        Info.addFields({
            name: "User",
            value: common_tags_1.stripIndents `
    **❯** Username: ${username}
    **❯** Tag: ${tag}
    **❯** Discriminator: ${discriminator}
    **❯** ID: ${id}
    **❯** Flags: ${flags !== null && flags.toArray().length > 0
                ? Util_1.Util.trim(Util_1.Util.badges(flags.toArray()))
                : "None"}
    **❯** Account Created: ${new Intl.DateTimeFormat("en-US")
                .format(createdAt)
                .replace(/\//g, "-")} (${ms_1.default(Date.now() - createdTimestamp, {
                long: true,
            })} ago)
    **❯** Bot: ${bot ? "Yes" : "No"}
    **❯** Status: ${Util_1.Util.status(presence.status)}
    **❯** Game Playing: ${presence.activities.length > 0 ? presence.activities[0].name : "None"}`,
        }, {
            name: "Member",
            value: common_tags_1.stripIndents `
        **❯** Nickname: ${displayName}
        **❯** Joined: ${new Intl.DateTimeFormat("en-US")
                .format(joinedAt)
                .replace(/\//g, "-")} (${ms_1.default(Date.now() - joinedTimestamp, {
                long: true,
            })} ago)
        **❯** Boosting Since: ${premiumSince
                ? new Intl.DateTimeFormat("en-US")
                    .format(premiumSinceTimestamp)
                    .replace(/\//g, "-")
                : "Not Boosting"}
        **❯** Permissions: ${permissions.toArray().length > 0
                ? Util_1.Util.trim(Util_1.Util.normalize(permissions.toArray(true)))
                : "None"}
        **❯** Roles: ${Util_1.Util.trim(Util_1.Util.normalize(roles.cache
                .sort((r, h) => {
                return h.position - r.position;
            })
                .map((r) => {
                return r.toString();
            })))}
        **❯** Hoist Role: ${roles.cache
                .sort((r, h) => {
                return h.position - r.position;
            })
                .find((r) => {
                return r.hoist;
            })?.id
                ? roles.cache
                    .sort((r, h) => {
                    return h.position - r.position;
                })
                    .find((r) => {
                    return r.hoist;
                })
                    .toString()
                : "None"}`,
        });
        message.channel.send(Info);
    }
}
exports.default = UserInfoCommand;
