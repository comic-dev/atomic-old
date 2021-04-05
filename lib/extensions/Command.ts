import {
	Command as AkairoCommand,
	CommandOptions as AkairoCommandOptions
} from 'discord-akairo';
import { Atomic } from '@atomic/lib/extensions/Atomic';
import { Runner } from '@atomic/lib/Runner';
import { Message } from 'discord.js';
export class Command extends AkairoCommand {
	public constructor(id: string, options?: CommandOptions) {
		super(id, {
			...options,
			channel: options.channel ?? 'guild'
		});
	}

	public description: CommandDescription;
	public client: Atomic;
	public async exec(
		message: Message,
		args: { [key: string]: any }
	): Promise<any> {}
}

interface CommandOptions extends AkairoCommandOptions {
	description?: CommandDescription;
}

interface CommandDescription {
	content?: string;
	usage?: string;
	examples?: string[];
}
