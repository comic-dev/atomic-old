import { stripIndents } from 'common-tags';
import { Argument } from 'discord-akairo';
import { Command } from '../../Structures/Command';
import { Util } from '../../Structures/Util';
import { GuildMember, Message, MessageEmbed } from 'discord.js';
import * as PrettyMS from 'pretty-ms';
export default class UserInfoCommand extends Command {
	public constructor() {
		super('userinfo', {
			aliases: ['userinfo', 'ui', 'user', 'u'],
			category: 'Information',
			description: {
				content: 'Shows specific information about an guild member',
				usage: '$userinfo [ member ]',
				examples: ['$userinfo comic.#6949', '$userinfo 589390599740719105'],
			},
			cooldown: 3000,
			args: [
				{
					id: 'member',
					match: 'content',
					type: Argument.union('member', 'relevant'),
					default: (msg: Message) => {
						return msg.member;
					},
				},
			],
		});
	}

	public async exec(
		message: Message,
		{ member }: { member: GuildMember }
	): Promise<any> {
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

		const Info: MessageEmbed = new MessageEmbed()
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
				name: 'User',
				value: stripIndents`
    **❯** Username: ${username}
    **❯** Tag: ${tag}
    **❯** Discriminator: ${discriminator}
    **❯** ID: ${id}
    **❯** Badges: ${
			flags !== null && flags.toArray().length > 0
				? Util.badges(flags.toArray())
				: 'None'
		}
    **❯** Account Created: ${new Intl.DateTimeFormat('en-US')
			.format(createdAt)
			.replace(/\//g, '-')} (${PrettyMS.default(
					Date.now() - Date.parse(createdAt.toISOString()),
					{ compact: true, verbose: true }
				)} ago)
    **❯** Bot: ${bot ? 'Yes' : 'No'}
    **❯** Status: ${Util.status(presence.status)}
    **❯** Game Playing: ${
			presence.activities.length > 0 ? presence.activities[0].name : 'None'
		}`,
			},
			{
				name: 'Member',
				value: stripIndents`
        **❯** Nickname: ${displayName}
        **❯** Joined: ${new Intl.DateTimeFormat('en-US')
					.format(joinedAt)
					.replace(/\//g, '-')} (${PrettyMS.default(
					Date.now() - Date.parse(joinedAt.toISOString()),
					{ compact: true, verbose: true }
				)} ago)
        **❯** Boosting Since: ${
					premiumSince
						? new Intl.DateTimeFormat('en-US')
								.format(premiumSinceTimestamp)
								.replace(/\//g, '-')
						: 'Not Boosting'
				}
        **❯** Permissions: ${
					permissions.toArray().length > 0
						? Util.trim(Util.normalize(permissions.toArray(true)))
						: 'None'
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
        **❯** Hoist Role: ${roles.hoist ?? 'None'}`,
			}
		);
		message.channel.send(Info);
	}
}
