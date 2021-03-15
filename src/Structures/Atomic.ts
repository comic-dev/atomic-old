import {
	AkairoClient,
	CommandHandler,
	ListenerHandler,
	InhibitorHandler,
} from 'discord-akairo';
import { Message, Intents } from 'discord.js';
import { join } from 'path';
import { Config, Prefix } from '../Config';
export class Atomic extends AkairoClient {
	public config: Config;
	public listenerHandler: ListenerHandler = new ListenerHandler(this, {
		directory: join(__dirname, '..', 'Events'),
	});

	public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
		directory: join(__dirname, '..', 'Inhibitors'),
	});

	public commandHandler: CommandHandler = new CommandHandler(this, {
		directory: join(__dirname, '..', 'Commands'),
		prefix: (message: Message) => {
			return Prefix(message);
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
					return `${str}\n\n**Type \`cancel\` to cancel the command...**`;
				},
				modifyRetry: (msg: Message, str: string): string => {
					return `${str}\n\n**Type \`cancel\` to cancel the command...**`;
				},
				timeout:
					'**You took too long to respond, the command has been cancelled**',
				ended:
					'**You exceeded the maximum amount of tries, the command has been cancelled**',
				retries: 3,
				time: 3e4,
			},
			otherwise: '',
		},
	});

	public constructor(config: Config) {
		super({
			ws: {
				intents: Intents.ALL,
			},
			partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
			ownerID: config.owner,
		});
		this.config = config;
	}

	private async _init(): Promise<void> {
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
			process,
		});

		this.commandHandler.loadAll();
		this.listenerHandler.loadAll();
	}

	public boot() {
		this._init();
		this.login(this.config.token);
		return this;
	}
}
