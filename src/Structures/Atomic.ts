import { Client, Collection, Intents } from "discord.js";
import { CommandType } from "../Structures/Command";
import { EventType } from "../Structures/Event";
import { DotenvConfigOutput } from "dotenv";
import consola, { Consola } from "consola";
import { GlobSync } from "glob";
import { join } from "path";
import Chalk from "chalk";

export class Atomic extends Client {
  public TOKEN: string;
  public prefix: string;
  public PATHS: string[];

  public commands: Collection<string, CommandType> = new Collection();
  public aliases: Collection<string, CommandType> = new Collection();
  public cooldowns: Collection<string, number> = new Collection();
  public events: Collection<string, EventType> = new Collection();
  public categories: Collection<string, String[]> = new Collection();

  public logger: Consola = consola;

  constructor() {
    super({
      ws: { intents: Intents.ALL },
      partials: ["USER", "MESSAGE", "REACTION", "GUILD_MEMBER", "CHANNEL"],
    });
  }

  init(props: DotenvConfigOutput, paths: string[]): Atomic {
    Object.assign(this, {
      ...JSON.parse(JSON.stringify(props?.parsed)),
      PATHS: paths,
    });
    this.handler(this.PATHS);
    this.login(this.TOKEN);
    this.on("warn", this.logger.warn);
    this.on("debug", this.logger.debug);
    return this;
  }

  async handler(paths: string[]) {
    new GlobSync(join("**", paths[0], "**", "**.ts")).found?.map(
      async (f: string) => {
        let File: CommandType = new (
          await import(join(process.cwd(), f))
        ).default();
        File?.aliases
          ? this.commands.set(File.name, File) &&
            File.aliases.map((a: string) => {
              this.aliases.set(a, File);
            })
          : this.commands.set(File.name, File);

        this.logger.log(
          Chalk.bold(Chalk.grey(`[Atomic]`)) +
            " " +
            Chalk.bold(`Loaded command ${Chalk.cyan(File.name)}`)
        );
      }
    );

    new GlobSync(join("**", paths[1], "**.ts")).found?.map(
      async (f: string) => {
        const File: EventType = new (
          await import(join(process.cwd(), f))
        ).default();
        this.on(File.name, File.run.bind(null, this));
        this.events.set(File.name, File);
        this.logger.log(
          Chalk.bold(
            `${Chalk.grey(`[Atomic]`)} Loaded event ${Chalk.cyan(File.name)}`
          )
        );
      }
    );
  }
}
