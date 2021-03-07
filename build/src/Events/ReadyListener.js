"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class ReadyListener extends discord_akairo_1.Listener {
    constructor() {
        super("ready", {
            emitter: "client",
            event: "ready",
            category: "client",
        });
    }
    exec() {
        console.log(`[${this.client.user.username}] Connected to Discord Gateway`);
    }
}
exports.default = ReadyListener;
