import { Message } from 'discord.js';

export interface Runner<T extends { [key: string]: any }> {
	(message: Message, args: T);
}
