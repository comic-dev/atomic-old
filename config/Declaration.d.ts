import { Atomic } from '@atomic/lib/extensions/Atomic';
import { Consola } from 'consola';
import {
	AkairoClient,
	CommandHandler,
	ListenerHandler,
	InhibitorHandler
} from 'discord-akairo';
import { MessageEmbed, Message } from 'discord.js';
import { Client } from 'faunadb';
declare module 'discord-akairo' {
	interface AkairoClient {
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		inhibitorHandler: InhibitorHandler;
		logger: Consola;
		config: Config;
		db: Client;
		embed(msg: Message, data): MessageEmbed;
	}
}

export interface Config {
	token: string;
	owner: string;
	prefix: string;
	faunaDB: { secret: string };
}
