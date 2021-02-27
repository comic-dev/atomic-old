import { Client } from "@typeit/discord";
import { Intents } from "discord.js";
import { Config } from "./Interfaces/Config";
import * as config from "../config.json";
import { join } from "path";
import { Atomic } from "./Client/Atomic";
export abstract class Main {
    private static _client: Client
    public static async boot(Config: Config, paths: string[]): Promise<void> {
    const client: Atomic = new Atomic({
        partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
        classes: [
            ...paths,
            Atomic
        ],
        variablesChar: ":",
        silent: false,
        ws: {
            intents: Intents.ALL
        }
    });
    client.login(Config.token);
    this._client = client;
    }
}
Main.boot(config, [
    join(process.cwd(), 'src', 'Commands', "**", "**.ts"),
    join(process.cwd(), 'src', "Events","**.ts")
])