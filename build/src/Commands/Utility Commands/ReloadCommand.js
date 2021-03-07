"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class ReloadCommand extends discord_akairo_1.Command {
    constructor() {
        super("reload", {
            aliases: ["reload", "rl"],
            ownerOnly: true,
            args: [
                {
                    id: "command",
                    type: discord_akairo_1.Argument.union("command", "commandAlias"),
                    match: "content",
                },
            ],
        });
    }
    *args() {
        discord_akairo_1.Flag.continue(yield {
            type: ["reload-all", "all"],
        });
    }
}
exports.default = ReloadCommand;
