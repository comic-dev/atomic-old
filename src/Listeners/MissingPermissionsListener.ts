import { Message, PermissionString, MessageEmbed } from 'discord.js';
import { Command, Listener } from 'discord-akairo';
import { Util } from '@atomic/util/Util';

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
			message.util
				.send(
					this.client
						.embed(message, {})
						.setTitle('Command Blocked')
						.setDescription(
							`The \`${
								command.id
							}\` command could not be executed due to the bot missing the **${Util.normalize(
								missing
							)}** permission(s)`
						)
				)
				.then((m) => {
					setTimeout(() => {
						m.delete();
					}, 3000);
				});
		} else if (type === 'user') {
			message.util
				.send(
					this.client
						.embed(message, {})
						.setTitle('Command Blocked')
						.setDescription(
							`You're missing the **${Util.normalize(
								missing
							)}** permission(s) which are required to use the \`${
								command.id
							}\` command.`
						)
				)
				.then((m) => {
					setTimeout(() => {
						m.delete();
					}, 3000);
				});
		}
	}
}
