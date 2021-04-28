import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
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

	public async exec(
		message: Message,
		{ query, proj }: { query: string; proj: string }
	): Promise<any> {
		if (!query) return;
		try {
			const res: AxiosResponse<object> = await Axios.get(
				`https://djsdocs.sorta.moe/v2/embed?src=${proj}&q=${encodeURIComponent(
					query
				)}`
			);
			message.util.send({ embed: this.client.embed(message, res.data) });
		} catch (err) {
			message.util.send({
				embed: this.client.embed(message, { description: 'No results found.' })
			});
		}
	}
}
