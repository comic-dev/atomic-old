import { Command, Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';
import { Select, Call, Function as Fn } from 'faunadb';
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
				Select('disabled', Call(Fn('guild'), message.guild.id, 'data'))
			)
		).includes(command.id);
	}
}
