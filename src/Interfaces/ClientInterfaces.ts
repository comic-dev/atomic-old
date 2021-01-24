import { BitFieldResolvable, Message, PermissionString } from "discord.js";
import { Atomic } from "../Structures/Atomic";

export class Command {
  public name: string;
  public aliases: string[];
  public user?: {
    permissions: BitFieldResolvable<PermissionString>[];
  };
  public client?: {
    permissions: BitFieldResolvable<PermissionString>[];
  };
  public description?: string;
  public timeout?: number = 3000;
  public usage?: string;
  public run: Run;
}

export interface Run {
  (client?: Atomic, message?: Message, args?: string[]): Promise<any>;
}

export class Event {
  public name: string;
  public run: Run;
}
