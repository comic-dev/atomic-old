import { Message } from 'discord.js';
import { prefix } from '../config.json';
export async function Prefix(msg: Message) {
	return prefix;
}
