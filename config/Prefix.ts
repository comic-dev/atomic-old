import { Atomic } from '@atomic/lib/extensions/Atomic';
import { Message } from 'discord.js';
import { Exists, Get, If, Index, Match } from 'faunadb';
import { prefix } from '../config.json';
export async function Prefix(msg: Message, client: Atomic) {
	return (
		(
			await client.db.query<{ data: { prefix: string } }>(
				If(
					Exists(Match(Index('guilds_by_id'), msg.guild.id)),
					Get(Match(Index('guilds_by_id'), msg.guild.id)),
					null
				)
			)
		)?.data?.prefix ?? prefix
	);
}
