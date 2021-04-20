import { Command, Flag } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { Call, Function as Fn, Select } from 'faunadb';
export default class PrefixCommand extends Command {
	public constructor() {
		super('prefix', {
			aliases: ['prefix', 'pr'],
			category: 'Configuration',
			description: {
				content: 'Set or reset the custom prefix for the current guild'
			}
		});
	}

	public *args() {
		const method = yield {
			type: [
				['prefix-set', 'set', 'apply'],
				['prefix-reset', 'reset', 'remove']
			],
			otherwise: async (message: Message) =>
				this.client
					.embed(message, {})
					.setDescription(
						`The current prefix for **${
							message.guild.name
						}** is \`${await this.client.db.query(
							Select('prefix', Call(Fn('guild'), message.guild.id))
						)}\``
					)
		};
		return Flag.continue(method);
	}
}
