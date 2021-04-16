import {
	AkairoClient,
	CommandHandler,
	ListenerHandler,
	InhibitorHandler
} from 'discord-akairo';
import { Message, Intents } from 'discord.js';
import {
	Client,
	Collection,
	Create,
	Exists,
	Get,
	If,
	Index,
	Match,
	Select
} from 'faunadb';
import { join } from 'path';
import consola, { Consola } from 'consola';
import { Config } from '@atomic/config/Declaration';
import { MessageEmbed } from 'discord.js';
export class Atomic extends AkairoClient {
	public logger: Consola = consola;
	public config: Config;
	public db: Client;

	public constructor(config: Config) {
		super({
			ws: {
				intents: Intents.ALL
			},
			partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
			ownerID: config.owner
		});
		this.config = config;
		this.db = new Client({ secret: this.config.faunaDB.secret });
	}

	public listenerHandler: ListenerHandler = new ListenerHandler(this, {
		directory: join(__dirname, '..', '..', 'src', 'Listeners')
	});

	public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
		directory: join(__dirname, '..', '..', 'src', 'Inhibitors')
	});

	public commandHandler: CommandHandler = new CommandHandler(this, {
		directory: join(__dirname, '..', '..', 'src', 'Commands'),
		prefix: async (msg: Message) => {
			{
				return await this.db.query<string>(
					If(
						Exists(Match(Index('guilds_by_id'), msg.guild.id)),
						Select(
							'prefix',
							Select('data', Get(Match(Index('guilds_by_id'), msg.guild.id)))
						),
						Select(
							'prefix',
							Select(
								'data',
								Create(Collection('guilds'), {
									data: {
										guild: msg.guild.id,
										prefix: this.config.prefix,
										disabled: []
									}
								})
							)
						)
					)
				);
			}
		},
		allowMention: true,
		handleEdits: true,
		commandUtil: true,
		commandUtilLifetime: 300000,
		defaultCooldown: 3000,
		ignoreCooldown: [],
		argumentDefaults: {
			prompt: {
				modifyStart: (msg: Message, str: string): string => {
					return `${str}\n\nType \`cancel\` to cancel the command...`;
				},
				modifyRetry: (msg: Message, str: string): string => {
					return `${str}\n\nType \`cancel\` to cancel the command...`;
				},
				timeout: 'You took too long to respond, the command has been cancelled',
				ended:
					'You exceeded the maximum amount of tries, the command has been cancelled',
				cancel: 'You cancelled the command',
				retries: 3,
				time: 3e4
			},
			otherwise: ''
		}
	});

	private async _init(): Promise<void> {
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
			process
		});

		this.commandHandler.loadAll();
		this.listenerHandler.loadAll();
		this.inhibitorHandler.loadAll();
	}

	public boot() {
		this._init();
		this.login(this.config.token);
		return this;
	}

	public embed(msg: Message): MessageEmbed {
		return new MessageEmbed()
			.setFooter(
				`Requested by: ${msg.author.tag}`,
				msg.author.displayAvatarURL({ dynamic: true })
			)
			.setTimestamp();
	}
}
