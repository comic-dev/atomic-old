import { Message, MessageEmbed } from 'discord.js';
import { Command } from '@atomic/lib/extensions/Command';
import MS from 'ms';
import { GuildMember } from 'discord.js';
import { Runner } from '@atomic/lib/Runner';
export default class BanCommand extends Command {
	public constructor() {
		super('ban', {
			aliases: ['ban'],
			category: 'Moderation',
			description: {
				content: 'Bans the specified member',
				usage: '$ban [ member ] ( time ) [ reason ]',
				examples: [
					'$ban comic 1d Breaking the rules',
					'$ban @comic.#6949 Simping'
				]
			},
			cooldown: 3000,
			userPermissions: ['BAN_MEMBERS'],
			clientPermissions: ['BAN_MEMBERS'],
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: `Please specify an member to ban`,
						retry: `Please specify an valid member to ban`
					}
				},
				{
					id: 'time',
					type: (message, phrase) => {
						if (phrase && MS(phrase) > 0) return MS(phrase);
						if (['perm', 'permanent'].includes(phrase.toLowerCase()))
							return 'Permanent';
						return null;
					},
					prompt: {
						start: `Please specify an time period`,
						retry: `Please specify an valid time period`
					}
				},
				{
					id: 'reason',
					type: 'string',
					default: 'No reason specified'
				}
			]
		});
	}

	public exec: Runner<{
		member: GuildMember;
		time: any;
		reason: string;
	}> = async (message: Message, { member, time, reason }): Promise<any> => {
		if (member.id === message.member.id)
			return message.channel
				.send(new MessageEmbed().setDescription('You cannot ban yourself.'))
				.then((m) =>
					setTimeout(() => {
						m.delete();
					}, 5000)
				);
		if (
			(member.roles.highest.position > message.member.roles.highest.position &&
				message.guild.owner.id !== message.member.id) ||
			member.id === message.guild.owner.id
		)
			return message.channel
				.send(
					new MessageEmbed().setDescription(
						`**${member.user.username}** has an higher staff position than you. You cannot ban them`
					)
				)
				.then((m) =>
					setTimeout(() => {
						m.delete();
					}, 5000)
				);
		member
			.send(
				new MessageEmbed().setDescription(
					`You've been banned from **${message.guild.name}** with the reason of **${reason}**`
				)
			)
			.catch(() => null);
		member.ban({ reason: reason });
		if (time.toLowerCase() !== 'permanent') {
			setTimeout(() => {
				message.guild.members.unban(member.id, 'Ban period expired');
			}, time);
		} else return;
	};
}
