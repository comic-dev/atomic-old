import { Command, Category } from 'discord-akairo';
import { Util } from '@atomic/util/Util';
import {
	Collection as Col,
	Message,
	MessageEmbed,
	MessageCollector,
	ReactionCollector,
	MessageReaction,
	User
} from 'discord.js';
import {
	Call,
	Function as Fn,
	Select,
	Map,
	Documents,
	Get,
	Lambda,
	Let,
	Paginate,
	Var,
	Collection
} from 'faunadb';
export default class HelpCommand extends Command {
	public constructor() {
		super('help', {
			aliases: ['help', 'h'],
			category: 'Information',
			description: {
				content: 'Sends the interactive help menu for Atomic',
				usage: '$help [ command ]',
				examples: ['$help', '$help p', '$help ping']
			},
			cooldown: 3000,
			clientPermissions: ['ADD_REACTIONS'],
			args: [
				{
					id: 'command',
					type: (message, phrase) => {
						return Util.search(phrase, this.handler.modules, message);
					},
					default: null,
					match: 'content'
				}
			]
		});
	}

	public async exec(
		message: Message,
		{ command }: { command: Command }
	): Promise<any> {
		let SearchCollector: MessageCollector;
		const prefix: string = await this.client.db.query(
			Select('prefix', Call(Fn('guild'), [message.guild.id, 'data']))
		);
		if (!command || command === null) {
			const Home: MessageEmbed = this.client
				.embed(message, {})
				.setTitle('Atomic Help | Home')
				.addFields([
					{
						name: '🏠 | Home',
						value: 'Returns to this page'
					},
					{
						name: '📚 | Commands',
						value: 'Shows all categories along with their commands'
					},
					{
						name: '🔎 | Search',
						value: 'Search for any command or alias'
					},
					{
						name: '🔧 | Customs',
						value: 'Show all custom commands for this guild'
					}
				])
				.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
				.setColor('RANDOM');
			const Commands: MessageEmbed = new MessageEmbed()
				.setTitle('Atomic Help | Commands')
				.setDescription(
					`View all commands and their categories below\nFor further info about a specific command, use \`${prefix}help <Command>\``
				)
				.setColor('RANDOM')
				.setFooter(
					`Requested by: ${message.author.tag} | Current prefix: ${prefix}`
				)
				.setTimestamp();
			this.handler.categories.each(
				(c: Category<string, Command>, s: string) => {
					if (
						c.filter((v: any) => {
							return v?.guild ? v.guild === message.guild.id : true;
						}).size < 1
					)
						return;
					Commands.addField(
						`❯ ${s} [${c.size}]`,
						`\`${c
							.filter((v: any) => {
								return v?.guild ? v.guild === message.guild.id : true;
							})
							.map((c) => c.id)
							.join('`, `')}\``
					);
				}
			);

			const Search: MessageEmbed = this.client
				.embed(message, {})
				.setTitle('Atomic Help | Search')
				.setDescription('Find commands or aliases by typing a query')
				.setColor('RANDOM');

			const Customs: MessageEmbed = this.client
				.embed(message, {})
				.setColor('RANDOM')
				.setTitle(`**Custom Commands for ${message.guild.name}**`)
				.setDescription(
					`\n${(
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
					)
						.map((v) => {
							if (v.guild !== message.guild.id) return null;
							return v.commands.map((v) => {
								return `\`${v.id}\``;
							});
						})
						.filter((v) => {
							return v?.filter((v) => {
								return !!v;
							});
						})
						.join('` `')}`
				);

			const msg: Message = await message.util.send(Home);
			try {
				await msg.react('🏠');
				await msg.react('📚');
				await msg.react('🔎');
				await msg.react('🔧');
			} catch (er) {
				console.log(er);
			}

			const collector: ReactionCollector = msg.createReactionCollector(
				(r: MessageReaction, u: User) => {
					return ['🏠', '📚', '🔎', '🔧'].includes(r.emoji.name) && !u.bot;
				},
				{ time: 3e5 }
			);

			collector.on('collect', async (r: MessageReaction, u: User) => {
				if (u.bot) return;
				if (!['🏠', '📚', '🔎', '🔧'].includes(r.emoji.name)) return;
				r.users.remove(u.id);
				switch (r.emoji.name) {
					case '🏠':
						msg.edit(Home);
						if (SearchCollector?.client) SearchCollector.stop();
						break;

					case '📚':
						msg.edit(Commands);
						if (SearchCollector?.client) SearchCollector.stop();
						break;
					case '🔎':
						msg.edit(Search);
						SearchCollector = msg.channel.createMessageCollector(
							(m: Message, u: User) => {
								return !u.bot;
							},
							{ time: 300000 }
						);
						SearchCollector.on('collect', (m: Message) => {
							if (m.content.toLowerCase() === 'cancel') {
								message.util.send(
									this.client
										.embed(message, {})
										.setTitle('Cancelling')
										.setColor('RANDOM')
								);
								SearchCollector.stop('CANCELED');
								return setTimeout(() => {
									msg.edit(Home);
								}, 1500);
							}
							let res = Util.search(m.content, this.handler.modules, message);

							if (!res) {
								const None: MessageEmbed = new MessageEmbed({
									description:
										'No commands or aliases have been found.\n\n**Returning to home.**'
								});
								setTimeout(() => {
									SearchCollector.stop('NONE');
									msg.edit(Home);
								}, 3000);
								msg.edit(None);
								m.delete();
								return SearchCollector.stop();
							}
							if (res) {
								const Result: MessageEmbed = Util.help(res, this.client);
								SearchCollector.stop('FOUND');
								msg.edit(Result);
							}
						});
						SearchCollector.on(
							'end',
							async (collected: Col<string, Message>, reason: string) => {
								if (reason !== 'FOUND') {
									setTimeout(() => {
										msg.edit(Home);
									}, 3000);
								}
							}
						);
						break;

					case '🔧':
						if (SearchCollector?.client) SearchCollector.stop();
						msg.edit(Customs);
						break;
				}
			});
		} else {
			let Embed: MessageEmbed = Util.help(command, this.client)
				.setColor('RANDOM')
				.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }));
			message.util.send(Embed);
		}
	}
}
