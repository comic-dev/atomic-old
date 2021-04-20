import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { Get, Index, Match, Select, Update } from 'faunadb';
export default class PrefixSetCommand extends Command {
	public constructor() {
		super('prefix-set', {
			cooldown: 5000,
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
			Update(Select('ref', Get(Match(Index('guilds.id'), message.guild.id))), {
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
