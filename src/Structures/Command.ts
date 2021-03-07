import {
  Command as AkairoCommand,
  CommandOptions as AkairoCommandOptions,
} from "discord-akairo";
export class Command extends AkairoCommand {
  public constructor(id: string, options?: CommandOptions) {
    super(id, {
      ...options,
      channel: options.channel ?? "guild",
    });
  }

  public description: CommandDescription;
}

interface CommandOptions extends AkairoCommandOptions {
  description: CommandDescription;
}

interface CommandDescription {
  content: string;
  usage: string;
  examples: string[];
}
