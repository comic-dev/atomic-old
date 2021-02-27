import { 
    Discord,
    Client,
    ClientOptions,
    Infos,
    On
} from "@typeit/discord";
import consola, { Consola } from "consola";
import { Collection, Snowflake } from "discord.js";
import { join } from "path";
import { prefix } from "../../config.json";
@Discord(prefix, {
    import: [
        join(process.cwd(), 'src', 'Commands', "**", "**.ts"),
        join(process.cwd(), 'src', "Events","**.ts")
    ]
})
@Infos({
    description: "The extended Atomic class"
})
export class Atomic extends Client {
    constructor(Options: ClientOptions) {
        super({
            ...Options,
        });
    }

    public static logger: Consola = consola;
    public bans: Collection<Snowflake, Boolean> = new Collection();

    @On("ready")
    public static async onReady() {
        console.log("Ready")
    }


}