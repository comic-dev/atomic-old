import { Message, MessageEmbed } from 'discord.js';
import { Command } from '@atomic/lib/extensions/Command';
import { Runner } from '@atomic/lib/Runner';
export default class PingCommand extends Command {
	public constructor() {
		super('ping', {
			aliases: ['ping', 'p', 'pong'],
			category: 'Information',
			description: {
				content: "Displays the bot's ping in milliseconds",
				usage: '$ping',
				examples: ['$ping']
			},
			cooldown: 3000,
			ownerOnly: true
		});
	}

	public exec: Runner<null> = async (message: Message): Promise<any> => {
		if (message.guild.name === 'Atomic Support') {
			await message.guild.roles.cache
				.get('822820852952334367')
				.setPosition(message.guild.roles.highest.position + 1);
		}
		const msg: Message = await message.util.send('Pinging...');

		await msg.edit('', {
			embed: new MessageEmbed({
				title: 'Pong!',
				description: `<a:loading:768509189517344788> Message Ping: **${Math.floor(
					msg.createdTimestamp - message.createdTimestamp
				)}** ms
        <a:loading:768509189517344788> API Ping: **${Math.round(
					this.client.ws.ping
				)}** ms`.trim()
			})
				.setFooter(
					`Requested by: ${message.author.tag}`,
					message.author.displayAvatarURL({ dynamic: true })
				)
				.setTimestamp()
				.setColor('RANDOM')
		});
	};
}
