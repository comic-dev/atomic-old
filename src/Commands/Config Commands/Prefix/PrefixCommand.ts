import { Command, Flag } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { Exists, Get, If, Index, Match, Select } from 'faunadb';
export default class PrefixCommand extends Command {
	public constructor() {
		super('prefix', {
			aliases: ['prefix', 'pr'],
			category: 'Information'
		});
	}

	public *args() {
		const method = yield {
			type: [
				['prefix-set', 'set', 'apply'],
				['prefix-reset', 'reset', 'remove']
			]
		};
		Flag.continue(method);
	}

	public async exec(message: Message): Promise<any> {
		message.util.send(
			new MessageEmbed().setDescription(
				`The current prefix for **${
					message.guild.name
				}** is \`${await this.client.db.query(
					If(
						Exists(Match(Index('guilds_by_id'), message.guild.id)),
						Select(
							'prefix',
							Select(
								'data',
								Get(Match(Index('guilds_by_id'), message.guild.id))
							)
						),
						this.client.config.prefix
					)
				)}\``
			)
		);
	}
}
