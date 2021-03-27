import { Command } from '@atomic/lib/extensions/Command';
import { Runner } from '@atomic/lib/Runner';
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
	}

	public exec: Runner<null> = async (message: Message) => {
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
	};
}
