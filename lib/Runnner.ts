import { Message } from 'discord.js';

export interface Runner<T extends Record<string, any>> {
	(message: Message, args: T): Promise<any>;
}
