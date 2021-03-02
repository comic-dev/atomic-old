import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { join } from "path";
import { Config, Prefix } from "../Config";
import { owner } from "../../config.json";
import { Message } from "discord.js";
import { Intents } from "discord.js";
export class Atomic extends AkairoClient {
  public config: Config;
  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: join(process.cwd(), "src", "Events"),
  });

  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: join(process.cwd(), "src", "Commands"),
    prefix: (message: Message) => {
      return Prefix(message);
    },
    allowMention: true,
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: 3e5,
    defaultCooldown: 3e3,
    argumentDefaults: {
      prompt: {
        modifyStart: (msg: Message, str: string): string => {
          return `${str}\n\n**Type \`cancel\` to cancel the command...**`;
        },
        modifyRetry: (msg: Message, str: string): string => {
          return `${str}\n\n**Type \`cancel\` to cancel the command...**`;
        },
        timeout:
          "**You took too long to respond, the command has been cancelled**",
        ended:
          "**You exceeded the maximum amount of tries, the command has been cancelled**",
        retries: 3,
        time: 3e4,
      },
      otherwise: "",
    },
    ignoreCooldown: owner,
  });

  public constructor(config: Config) {
    super({
      ws: {
        intents: Intents.ALL,
      },
      partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
      ownerID: config.owner,
    });

    this.config = config;
  }

  private async _init(): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      process,
    });

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
  }

  public boot() {
    this._init();
    this.login(this.config.token);
    return this;
  }
}
