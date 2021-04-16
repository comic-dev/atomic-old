import { Message, MessageEmbed } from 'discord.js';
import { Command, Listener } from 'discord-akairo';
export default class CooldownListener extends Listener {
	public constructor() {
		super('cooldown', {
			event: 'cooldown',
			emitter: 'commandHandler',
			category: 'commandHandler'
		});
	}

	public async exec(message: Message, command: Command, left: number) {
		message.util
			.send(
				this.client
					.embed(message, {})
					.setTitle('Cooldown')
					.setDescription(
						`You're on a cooldown for **${(left / 1000).toFixed(
							1
						)}** more seconds.`
					)
			)
			.then((m) => {
				setTimeout(() => {
					m.delete();
				}, left);
			});
	}
}
