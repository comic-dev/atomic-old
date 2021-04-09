import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { Get, Index, Match, Select, Update } from 'faunadb';
export default class PrefixResetCommand extends Command {
	public constructor() {
		super('prefix-reset', {
			cooldown: 5000,
			category: 'Configuration'
		});
	}

	public async exec(message: Message): Promise<any> {
		await this.client.db.query(
			Update(
				Select('ref', Get(Match(Index('guilds_by_id'), message.guild.id))),
				{
					data: { prefix: this.client.config.prefix }
				}
			)
		);
		message.util.send(
			new MessageEmbed().setDescription(
				`The prefix for **${message.guild.name}** has been reset to \`${this.client.config.prefix}\``
			)
		);
	}
}
