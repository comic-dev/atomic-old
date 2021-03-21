import {
	AkairoClient,
	CommandHandler,
	ListenerHandler,
	InhibitorHandler
} from 'discord-akairo';
import Admin from 'firebase-admin';
import 'reflect-metadata';
declare module 'discord-akairo' {
	interface AkairoClient {
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		inhibitorHandler: InhibitorHandler;
	}
}

export interface Config {
	token: string;
	owner: string;
	prefix: string;
	mongoURI: string;
}
