import { stripIndents } from "common-tags";
import { Command } from "discord-akairo";
import { GuildMember, Message, MessageEmbed } from "discord.js";
import ms from "ms";
import { Util } from "../../Structures/Util";
export default class UserInfoCommand extends Command {
  public constructor() {
    super("User Info", {
      aliases: ["userinfo", "ui", "user", "u"],
      description: "Displays specific information about a user",
      category: "Information",
      args: [
        {
          id: "member",
          match: "content",
          type: "member",
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
    } = member.user;
    const {
      roles,
      permissions,
      joinedAt,
      joinedTimestamp,
      premiumSince,
      displayHexColor,
      displayName,
      lastMessage,
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
      flags.toArray().length > 0
        ? Util.trim(Util.normalize(flags.toArray()))
        : "None"
    }
    **❯** Account Created: ${new Intl.DateTimeFormat("en-US")
      .format(createdAt)
      .replace(/\//g, "-")} (${ms(Date.now() - createdTimestamp, {
          long: true,
        })} ago)
    **❯** Bot: ${bot ? "Yes" : "No"}`,
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
        **❯** Permissions: ${Util.trim(
          Util.normalize(permissions.toArray(true))
        )}
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
