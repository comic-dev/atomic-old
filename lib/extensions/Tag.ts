import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
export class Tag extends Command {
	public content: string;
	public guild: string;
	public constructor(data: { id: string; content: string; guild: string }) {
		const { id, content, guild } = data;
		super(id, {
			aliases: [id],
			category: 'Custom',
			channel: 'guild'
		});
		this.id = id;
		this.content = content;
		this.guild = guild;
	}

	public async exec(message: Message): Promise<any> {
		if (this.guild !== message.guild.id) return;
		return await message.util.send(this.content);
	}
}
