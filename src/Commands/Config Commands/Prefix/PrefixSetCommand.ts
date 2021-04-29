import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Function as Fn, Call, Update, Select } from 'faunadb';
export default class PrefixSetCommand extends Command {
	public constructor() {
		super('prefix-set', {
			cooldown: 10000,
			category: 'Configuration',
			args: [
				{
					id: 'prefix',
					match: 'content',
					type: 'string',
					prompt: {
						start: (msg: Message) => `${msg.author} Please specify an prefix`
					}
				}
			]
		});
	}

	public async exec(
		message: Message,
		{ prefix }: { prefix: string }
	): Promise<any> {
		await this.client.db.query(
			Update(Call(Fn('guild'), message.guild.id, 'ref'), {
				data: { prefix: prefix }
			})
		);
		message.util.send(
			this.client
				.embed(message, {})
				.setDescription(
					`The prefix for **${message.guild.name}** has been updated to \`${prefix}\``
				)
		);
	}
}
