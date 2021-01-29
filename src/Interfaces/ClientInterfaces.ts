import { Message } from "discord.js";
import { Atomic } from "../Structures/Atomic";

export interface Run {
  (client?: Atomic, message?: Message, args?: string[]): Promise<any>;
}