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
const discord_js_1 = require("discord.js");
const Command_1 = require("../../Structures/Command");
const common_tags_1 = require("common-tags");
const Util_1 = require("../../Structures/Util");
const discord_js_2 = require("discord.js");
const PrettyMS = __importStar(require("pretty-ms"));
class ServerInfoCommand extends Command_1.Command {
    constructor() {
        super('serverinfo', {
            aliases: ['serverinfo', 'guildinfo', 'si', 'gi'],
            category: 'Information',
            description: {
                content: 'Displays all the info about the current guild',
                examples: ['$serverinfo'],
                usage: '$serverinfo',
            },
        });
    }
    async exec(message) {
        const { premiumTier, premiumSubscriptionCount, region, name, id, ownerID, afkChannelID, available, members, memberCount, maximumMembers, emojis, explicitContentFilter, description, channels, createdAt, rulesChannelID, roles, joinedAt, } = message.guild;
        if (!available)
            return;
        const Embed = new discord_js_1.MessageEmbed()
            .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .addField(`Server info for ${name}`, common_tags_1.stripIndents `  
    **❯** Name: ${name}
    **❯** ID: ${id}
    **❯** Description: ${description ?? 'No description'}
    **❯** Created: ${new Intl.DateTimeFormat('en-US')
            .format(createdAt)
            .replace(/\//g, '-')} (${PrettyMS.default(Date.now() - Date.parse(createdAt.toISOString()), { compact: true, verbose: true })} ago)
    **❯** Members: ${memberCount} / ${maximumMembers}
    **❯** Channels: ${channels.cache.filter((v) => {
            return !(v instanceof discord_js_2.CategoryChannel);
        }).size}
    **❯** Roles: ${Util_1.Util.trim(roles.cache
            .sort((h, r) => r.position - h.position)
            .map((r) => r.toString()), 3)}
    **❯** Emojis: ${Util_1.Util.trim(emojis.cache.map((e) => e.toString()), 6)}
    **❯** Owner: ${await message.guild.members.fetch(ownerID)}
    **❯** Region: ${Util_1.Util.capitalize(region)}
    **❯** Explicit Content Filter: ${explicitContentFilter
            .split('_')
            .map((v) => {
            return Util_1.Util.capitalize(v);
        })
            .join(' ')}
    **❯** Boosting Tier: ${premiumTier}
    **❯** Boost Count: ${premiumSubscriptionCount}

    **❯** Humans: ${members.cache.filter((u) => !u.user.bot).size}
    **❯** Bots: ${members.cache.filter((u) => u.user.bot).size}
    **❯** Members Online: ${members.cache.filter((u) => {
            return u.user.presence.status !== 'offline';
        }).size}
    **❯** Bot Invited: ${new Intl.DateTimeFormat('en-US')
            .format(joinedAt)
            .replace(/\//g, '-')} (${PrettyMS.default(Date.now() - Date.parse(joinedAt.toISOString()), {
            compact: true,
            verbose: true,
        })})
    
    **❯** AFK Channel: ${afkChannelID ? channels.cache.get(afkChannelID) : 'None'}
    **❯** Rules Channel: ${rulesChannelID ? channels.cache.get(rulesChannelID) : 'None'}
    **❯** News Channel: ${channels.cache
            .filter((g) => {
            return g.type === 'news';
        })
            .first() ?? 'None'}`);
        message.channel.send(Embed);
    }
}
exports.default = ServerInfoCommand;
//# sourceMappingURL=ServerInfoCommand.js.map