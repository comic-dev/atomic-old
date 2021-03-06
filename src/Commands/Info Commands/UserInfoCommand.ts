import { stripIndents } from "common-tags";
import { Command, Argument } from "discord-akairo";
import { GuildMember, Message, MessageEmbed } from "discord.js";
import ms from "ms";
import { Util } from "../../Structures/Util";
export default class UserInfoCommand extends Command {
  public constructor() {
    super("userinfo", {
      aliases: ["userinfo", "ui", "user", "u"],
      description: "Displays specific information about a user",
      category: "Information",
      cooldown: 3000,
      args: [
        {
          id: "member",
          match: "content",
          type: Argument.union("member", "relevant"),
          default: (msg: Message) => {
            return msg.member;
          },
        },
      ],
    });
  }

  public async exec(message: Message, { member }: { member: GuildMember }) {
    const {
      username,
      tag,
      createdAt,
      createdTimestamp,
      discriminator,
      bot,
      flags,
      id,
      presence,
    } = member.user;
    const {
      roles,
      permissions,
      joinedAt,
      joinedTimestamp,
      premiumSince,
      premiumSinceTimestamp,
      displayHexColor,
      displayName,
    } = member;

    let Info: MessageEmbed = new MessageEmbed()
      .setTitle(`Info for ${username}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setColor(displayHexColor)
      .setFooter(
        `Requested by: ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp();

    Info.addFields(
      {
        name: "User",
        value: stripIndents`
    **❯** Username: ${username}
    **❯** Tag: ${tag}
    **❯** Discriminator: ${discriminator}
    **❯** ID: ${id}
    **❯** Flags: ${
      flags !== null && flags.toArray().length > 0
        ? Util.trim(Util.normalize(flags.toArray()))
        : "None"
    }
    **❯** Account Created: ${new Intl.DateTimeFormat("en-US")
      .format(createdAt)
      .replace(/\//g, "-")} (${ms(Date.now() - createdTimestamp, {
          long: true,
        })} ago)
    **❯** Bot: ${bot ? "Yes" : "No"}
    **❯** Status: ${Util.status(presence.status)}
    **❯** Game Playing: ${
      presence.activities.length > 0 ? presence.activities[0].name : "None"
    }`,
      },
      {
        name: "Member",
        value: stripIndents`
        **❯** Nickname: ${displayName}
        **❯** Joined: ${new Intl.DateTimeFormat("en-US")
          .format(joinedAt)
          .replace(/\//g, "-")} (${ms(Date.now() - joinedTimestamp, {
          long: true,
        })} ago)
        **❯** Boosting Since: ${
          premiumSince
            ? new Intl.DateTimeFormat("en-US")
                .format(premiumSinceTimestamp)
                .replace(/\//g, "-")
            : "Not Boosting"
        }
        **❯** Permissions: ${
          permissions.toArray().length > 0
            ? Util.trim(Util.normalize(permissions.toArray(true)))
            : "None"
        }
        **❯** Roles: ${Util.trim(
          Util.normalize(
            roles.cache
              .sort((r, h) => {
                return h.position - r.position;
              })
              .map((r) => {
                return r.toString();
              })
          )
        )}
        **❯** Hoist Role: ${roles.cache
          .sort((r, h) => {
            return h.position - r.position;
          })
          .find((r) => {
            return r.hoist;
          })
          .toString()}`,
      }
    );
    message.channel.send(Info);
  }
}
