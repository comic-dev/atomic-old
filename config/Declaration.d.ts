import { Atomic } from '@atomic/lib/extensions/Atomic';
import {
	AkairoClient,
	CommandHandler,
	ListenerHandler,
	InhibitorHandler
} from 'discord-akairo';
import { Client } from 'faunadb';
import Admin from 'firebase-admin';
import 'reflect-metadata';
declare module 'discord-akairo' {
	interface AkairoClient {
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		inhibitorHandler: InhibitorHandler;
		logger: Consola = consola;
		config: Config;
		db: Client;
	}
}

export interface Config {
	token: string;
	owner: string;
	prefix: string;
	faunaDB: { secret: string };
}
