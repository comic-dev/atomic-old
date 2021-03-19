import { Listener, Command } from 'discord-akairo';
import { Message, PermissionString, MessageEmbed } from 'discord.js';
import { Util } from '@atomic/lib/Util';

export default class MissingPermissionsListener extends Listener {
	public constructor() {
		super('missingPermissions', {
			emitter: 'commandHandler',
			event: 'missingPermissions',
			category: 'commandHandler'
		});
	}

	public exec(
		message: Message,
		command: Command,
		type: string,
		missing: PermissionString[]
	) {
		if (type === 'client') {
			message.channel
				.send(
					new MessageEmbed()
						.setTitle('Command Blocked')
						.setDescription(
							`The \`${
								command.id
							}\` command could not be executed due to the bot missing the **${Util.normalize(
								missing
							)}** permission(s)`
						)
						.setFooter(
							message.author.username,
							message.author.displayAvatarURL({ dynamic: true })
						)
						.setTimestamp()
				)
				.then((m) => {
					setTimeout(() => {
						m.delete();
					}, 3000);
				});
		} else if (type === 'user') {
			message.channel
				.send(
					new MessageEmbed()
						.setTitle('Command Blocked')
						.setDescription(
							`You're missing the **${Util.normalize(
								missing
							)}** permission(s) which are required to use the \`${
								command.id
							}\` command.`
						)
						.setFooter(
							message.author.username,
							message.author.displayAvatarURL({ dynamic: true })
						)
						.setTimestamp()
				)
				.then((m) => {
					setTimeout(() => {
						m.delete();
					}, 3000);
				});
		}
	}
}
