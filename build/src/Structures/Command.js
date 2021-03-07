"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const discord_akairo_1 = require("discord-akairo");
class Command extends discord_akairo_1.Command {
    constructor(id, options) {
        super(id, {
            ...options,
            channel: options.channel ?? "guild",
        });
    }
}
exports.Command = Command;
