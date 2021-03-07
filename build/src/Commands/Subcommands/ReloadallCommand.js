"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class ReloadallCommand extends discord_akairo_1.Command {
    constructor() {
        super("reload-all");
    }
    async exec(message) {
        message.reply("reload all");
    }
}
exports.default = ReloadallCommand;
