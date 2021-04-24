import { stripIndents } from 'common-tags';
import { Command, Category } from 'discord-akairo';
import { Util } from '@atomic/util/Util';
import {
	Collection,
	Message,
	MessageEmbed,
	MessageCollector,
	ReactionCollector,
	MessageReaction,
	User
} from 'discord.js';
import ms from 'ms';
import { Call, Function as Fn, Select } from 'faunadb';
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
						return Util.search(phrase, this.handler.modules);
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
			Select('prefix', Call(Fn('guild'), message.guild.id))
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
					Commands.addField(
						`❯ ${s} [${c.size}]`,
						`\`${c.map((c) => c.id).join('`, `')}\``
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
				.setTitle('Under Construction')
				.setDescription('This feature is currently still being developed.')
				.setColor('RANDOM');

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
								return msg.edit(Home);
							}
							let res = Util.search(m.content, this.handler.modules);
							const Result: MessageEmbed = this.client
								.embed(message, {})
								.setTitle('Atomic Help | Search Results')
								.setColor('RANDOM');
							if (!res) {
								Result.setDescription('No commands or aliases have been found');
								setTimeout(() => {
									SearchCollector.stop('NONE');
								}, 3000);
								msg.edit(Result);
								m.delete();
								return SearchCollector.stop();
							}
							if (res) {
								Result.setDescription('Found an Command');
								Result.setDescription(
									stripIndents`
                **❯** Name: ${res.id}
                **❯** Aliases: ${res.aliases ? res.aliases.join(', ') : 'None'}
                **❯** Category: ${res.categoryID}
                **❯** Description: ${res.description.content ?? 'None'}
                **❯** Cooldown: ${ms(
									res.cooldown ?? this.handler.defaultCooldown,
									{
										long: true
									}
								)}
                **❯** Usage: ${res.description.usage ?? 'None'}
                **❯** Examples: ${
									res.description.examples
										? `\n${res.description.examples.join(', ')}`
										: 'None'
								}
                ${res.ownerOnly ? '**Developer Only!**' : ''}`
								).setThumbnail(
									this.client.user.displayAvatarURL({ dynamic: true })
								);
							}
							SearchCollector.stop('FOUND');
							msg.edit(Result);
						});
						SearchCollector.on(
							'end',
							async (
								collected: Collection<string, Message>,
								reason: string
							) => {
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
			let Embed: MessageEmbed = this.client
				.embed(message, {})
				.setTitle('Atomic Help | Command Result')
				.setDescription(
					stripIndents`
      **❯** Name: ${command.id}
      **❯** Aliases: ${command.aliases ? command.aliases.join(', ') : 'None'}
      **❯** Category: ${command.categoryID}
      **❯** Description: ${command.description.content ?? 'None'}
      **❯** Cooldown: ${ms(command.cooldown ?? this.handler.defaultCooldown, {
				long: true
			})}
      **❯** Usage: ${command.description.usage ?? 'None'}
      **❯** Examples: ${
				command.description.examples
					? `\n${command.description.examples.join(', ')}`
					: 'None'
			}
      ${command.ownerOnly ? '**Developer Only!**' : ''}`
				)
				.setColor('RANDOM')
				.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }));
			message.util.send(Embed);
		}
	}
}
