"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Atomic = void 0;
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const path_1 = require("path");
const Config_1 = require("../Config");
class Atomic extends discord_akairo_1.AkairoClient {
    constructor(config) {
        super({
            ws: {
                intents: discord_js_1.Intents.ALL,
            },
            partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
            ownerID: config.owner,
        });
        this.listenerHandler = new discord_akairo_1.ListenerHandler(this, {
            directory: path_1.join(__dirname, "..", "Events"),
        });
        this.inhibitorHandler = new discord_akairo_1.InhibitorHandler(this, {
            directory: path_1.join(__dirname, "..", "Inhibitors"),
        });
        this.commandHandler = new discord_akairo_1.CommandHandler(this, {
            directory: path_1.join(__dirname, "..", "Commands"),
            prefix: (message) => {
                return Config_1.Prefix(message);
            },
            allowMention: true,
            handleEdits: true,
            commandUtil: true,
            commandUtilLifetime: 300000,
            defaultCooldown: 3000,
            ignoreCooldown: [],
            argumentDefaults: {
                prompt: {
                    modifyStart: (msg, str) => {
                        return `${str}\n\n**Type \`cancel\` to cancel the command...**`;
                    },
                    modifyRetry: (msg, str) => {
                        return `${str}\n\n**Type \`cancel\` to cancel the command...**`;
                    },
                    timeout: "**You took too long to respond, the command has been cancelled**",
                    ended: "**You exceeded the maximum amount of tries, the command has been cancelled**",
                    retries: 3,
                    time: 3e4,
                },
                otherwise: "",
            },
        });
        this.config = config;
    }
    async _init() {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
            process,
        });
        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }
    boot() {
        this._init();
        this.login(this.config.token);
        return this;
    }
}
exports.Atomic = Atomic;
