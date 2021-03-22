import { Atomic } from '@atomic/lib/extensions/Atomic';
import { Message } from 'discord.js';
import { Collection, Get, Ref } from 'faunadb';
import { prefix } from '../config.json';
export async function Prefix(msg: Message, client: Atomic) {
	return (
		(await client.db.query<{ prefix: string }>(Ref(Collection('guild'))))
			.prefix ?? prefix
	);
}
