import { Message, MessageEmbed } from 'discord.js';
import { Command } from '@atomic/lib/extensions/Command';
import { Listener } from '@atomic/lib/extensions/Listener';
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
				new MessageEmbed()
					.setTitle('Cooldown')
					.setDescription(
						`You're on a cooldown for **${(left / 1000).toFixed(
							1
						)}** more seconds.`
					)
					.setFooter(
						`Requested by: ${message.author.tag}`,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTimestamp()
			)
			.then((m) => {
				setTimeout(() => {
					m.delete();
				}, left);
			});
	}
}
