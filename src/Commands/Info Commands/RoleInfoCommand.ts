import { Message, MessageEmbed } from 'discord.js';
import { Command } from '@atomic/lib/extensions/Command';
import { Util } from '@atomic/lib/Util';
import { stripIndents } from 'common-tags';
import * as PrettyMS from 'pretty-ms';
import { Role } from 'discord.js';
import { Runner } from '@atomic/lib/Runnner';
export default class RoleInfo extends Command {
	public constructor() {
		super('roleinfo', {
			aliases: ['roleinfo', 'role', 'ri', 'r'],
			category: 'Information',
			description: {
				content: 'Displays info about an specific role',
				usage: '$roleinfo [ role ]',
				examples: ['$roleinfo member']
			},
			args: [
				{
					id: 'role',
					type: 'role',
					prompt: {
						start: (msg: Message) => `${msg.author} Please specify an role`,
						retry: (msg: Message) =>
							`${msg.author} Please specify an valid role`,
						retries: 3
					}
				}
			]
		});
	}
	public exec: Runner<{ role: Role }> = async (
		message: Message,
		{ role }: { role: Role }
	): Promise<any> => {
		const {
			name,
			id,
			createdAt,
			hexColor,
			hoist,
			permissions,
			position,
			members,
			mentionable,
			managed
		} = role;
		const Embed: MessageEmbed = new MessageEmbed()
			.addField(
				`Role info for ${name}`,
				stripIndents`
		**❯** Name: ${name}
		**❯** ID: ${id}
		**❯** Members: ${Util.trim(
			members.map((g) => g.toString()),
			5
		)}
		**❯** Created: ${new Intl.DateTimeFormat('en-US')
			.format(createdAt)
			.replace(/\//g, '-')} (${PrettyMS.default(
					Date.now() - Date.parse(createdAt.toISOString()),
					{ verbose: true, compact: true }
				)} ago)
		**❯** Color: ${hexColor}
		**❯** Position: ${message.guild.roles.highest.position - position}
		**❯** Hoist: ${hoist ? 'Yes' : 'No'}
		**❯** Permissions: ${Util.trim(Util.normalize(permissions.toArray(true)))}
		**❯** Mentionable: ${mentionable ? 'Yes' : 'No'}
		**❯** Bot Role: ${managed ? 'Yes' : 'No'}`
			)
			.setColor(hexColor);
		message.channel.send(Embed);
	};
}