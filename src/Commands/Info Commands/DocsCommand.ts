import { Message, MessageEmbed } from 'discord.js';
import { Command } from '@atomic/lib/extensions/Command';
import { Runner } from '@atomic/lib/Runner';
import Axios, { AxiosResponse } from 'axios';
export default class DocsCommand extends Command {
	public constructor() {
		super('docs', {
			aliases: ['docs', 'doc', 'djs'],
			category: 'Information',
			description: {
				content:
					'Search for any method or property on the specified documentation',
				usage: '$help [ query ] --src=( documentation )',
				examples: ['$docs Client.on', '$docs Collection.get --src=collection']
			},
			args: [
				{
					id: 'query',
					type: 'string',
					prompt: {
						start: 'Please specify an query'
					}
				},
				{
					id: 'proj',
					type: (message, phrase) => {
						if (
							[
								'stable',
								'master',
								'rpc',
								'commando',
								'akairo',
								'akairo-master',
								'collection'
							].includes(phrase.toLowerCase()) &&
							phrase.toLowerCase() !== 'akairo'
						) {
							return phrase;
						} else if (phrase.toLowerCase() === 'akairo')
							return 'akairo-master';
					},
					match: 'option',
					flag: '--src=',
					default: 'stable'
				}
			]
		});
	}

	public exec: Runner<{ query: string; proj: string }> = async (
		message: Message,
		{ query, proj }: { query: string; proj: string }
	): Promise<any> => {
		if (!query) return;
		const res: AxiosResponse<any> = await Axios.get(
			`https://djsdocs.sorta.moe/v2/embed?src=${proj}&q=${encodeURIComponent(
				query
			)}`
		);
		message.channel.send({ embed: res.data });
	};
}
