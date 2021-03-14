"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_tags_1 = require("common-tags");
const discord_akairo_1 = require("discord-akairo");
const Command_1 = require("../../Structures/Command");
const discord_js_1 = require("discord.js");
const Util_1 = require("../../Structures/Util");
const PrettyMS = __importStar(require("pretty-ms"));
class UserInfoCommand extends Command_1.Command {
    constructor() {
        super("userinfo", {
            aliases: ["userinfo", "ui", "user", "u"],
            category: "Information",
            description: {
                content: "Shows specific information about an guild member",
                usage: "$userinfo [ member ]",
                examples: ["$userinfo comic.#6949", "$userinfo 589390599740719105"]
            },
            cooldown: 3000,
            args: [
                {
                    id: "member",
                    match: "content",
                    type: discord_akairo_1.Argument.union("member", "relevant"),
                    default: (msg) => {
                        return msg.member;
                    }
                }
            ]
        });
    }
    async exec(message, { member }) {
        const { username, tag, createdAt, createdTimestamp, discriminator, bot, flags, id, presence } = member.user;
        const { roles, permissions, joinedAt, joinedTimestamp, premiumSince, premiumSinceTimestamp, displayHexColor, displayName } = member;
        const Info = new discord_js_1.MessageEmbed()
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
    **❯** Badges: ${flags !== null && flags.toArray().length > 0
                ? Util_1.Util.badges(flags.toArray())
                : "None"}
    **❯** Account Created: ${new Intl.DateTimeFormat("en-US")
                .format(createdAt)
                .replace(/\//g, "-")} (${PrettyMS.default(createdAt.getTime() - Date.now(), { compact: true, verbose: true })} ago)
    **❯** Bot: ${bot ? "Yes" : "No"}
    **❯** Status: ${Util_1.Util.status(presence.status)}
    **❯** Game Playing: ${presence.activities.length > 0 ? presence.activities[0].name : "None"}`
        }, {
            name: "Member",
            value: common_tags_1.stripIndents `
        **❯** Nickname: ${displayName}
        **❯** Joined: ${new Intl.DateTimeFormat("en-US")
                .format(joinedAt)
                .replace(/\//g, "-")} (${PrettyMS.default(joinedAt.getTime() - Date.now(), { compact: true, verbose: true })} ago)
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
        **❯** Hoist Role: ${roles.hoist ?? "None"}`
        });
        message.channel.send(Info);
    }
}
exports.default = UserInfoCommand;
//# sourceMappingURL=UserInfoCommand.js.map