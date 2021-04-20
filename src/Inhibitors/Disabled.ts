import { Command, Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';
import {
	If,
	Match,
	Index,
	Get,
	Select,
	Create,
	Collection,
	Exists
} from 'faunadb';
export default class Disabled extends Inhibitor {
	public constructor() {
		super('disabled', {
			category: 'command',
			type: 'post',
			reason: 'disabled'
		});
	}

	public async exec(message: Message, command: Command) {
		return (
			await this.client.db.query<string[]>(
				If(
					Exists(Match(Index('guilds.id'), message.guild.id)),
					Select(
						'disabled',
						Select('data', Get(Match(Index('guilds.id'), message.guild.id)))
					),
					Select(
						'disabled',
						Select(
							'data',
							Create(Collection('guilds'), {
								data: { guild: message.guild.id, disabled: [] }
							})
						)
					)
				)
			)
		).includes(command.id);
	}
}
