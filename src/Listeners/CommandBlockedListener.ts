import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'discord-akairo';
import { Listener } from 'discord-akairo';
export default class CommandBlockedListener extends Listener {
	public constructor() {
		super('commandBlocked', {
			event: 'commandBlocked',
			emitter: 'commandHandler',
			category: 'commandHandler'
		});
	}

	public async exec(message: Message, command: Command, reason: string) {
		console.log(reason);
		switch (reason) {
			case 'owner':
				message.util
					.send(
						new MessageEmbed()
							.setTitle('Blocked')
							.setDescription(`The ${command.id} command is owner only.`)
					)
					.then((m) => {
						setTimeout(() => {
							m.delete();
						}, 3000);
					});
				break;

			default:
				break;
		}
	}
}
