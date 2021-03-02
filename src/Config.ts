import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { Message } from "discord.js";
import { prefix } from "../config.json";
declare module "discord-akairo" {
  interface AkairoClient {
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
  }
}

export async function Prefix(msg: Message) {
  return prefix;
}

export interface Config {
  token: string;
  owner: string;
  prefix: string;
  mongoURI: string;
}
