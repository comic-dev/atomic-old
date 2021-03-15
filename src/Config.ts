import {
	AkairoClient,
	CommandHandler,
	ListenerHandler,
	InhibitorHandler,
} from 'discord-akairo';
import { Message } from 'discord.js';
import { prefix } from '../config.json';
import 'reflect-metadata';
declare module 'discord-akairo' {
	interface AkairoClient {
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		inhibitorHandler: InhibitorHandler;
	}
}

export async function Prefix(msg: Message) {
	return prefix;
}

export interface Config {
	token: string;
	owner: string;
	prefix: string;
	mongoURI: string;
}
