import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Call, Function as Fn, Select, Update } from 'faunadb';
export default class PrefixResetCommand extends Command {
	public constructor() {
		super('prefix-reset', {
			cooldown: 10000,
			category: 'Configuration'
		});
	}

	public async exec(message: Message): Promise<any> {
		await this.client.db.query(
			Update(Select('ref', Call(Fn('guild'), message.guild.id)), {
				data: { prefix: this.client.config.prefix }
			})
		);
		message.util.send(
			this.client
				.embed(message, {})
				.setDescription(
					`The prefix for **${message.guild.name}** has been reset to \`${this.client.config.prefix}\``
				)
		);
	}
}
