import { Tag } from '@atomic/lib/extensions/Tag';
import { Listener } from 'discord-akairo';
import {
	Map,
	Collection,
	Lambda,
	Select,
	Var,
	Paginate,
	Get,
	Documents,
	Let
} from 'faunadb';
export default class ReadyListener extends Listener {
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			category: 'client'
		});
	}

	public async exec(): Promise<void> {
		console.log(`[${this.client.user.username}] Connected to Discord Gateway`);
		this.client.user.setActivity({
			type: 'WATCHING',
			name: `@Atomic help | ${this.client.users.cache.size.toLocaleString()} users`
		});

		(
			await this.client.db.query<
				Array<{
					guild: string;
					commands: Array<{ id: string; content: string }>;
				}>
			>(
				Select(
					'data',
					Map(
						Paginate(Documents(Collection('guilds'))),
						Lambda(
							'g',
							Let(
								{ data: Select('data', Get(Var('g'))) },
								{
									commands: Select('commands', Var('data')),
									guild: Select('guild', Var('data'))
								}
							)
						)
					)
				)
			)
		).map((doc) => {
			doc.commands?.map((v) => {
				return this.client.commandHandler.register(
					new Tag({ id: v.id, content: v.content, guild: doc.guild })
				);
			});
		});
	}
}
