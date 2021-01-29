import { Run } from "../Interfaces/ClientInterfaces";

export class Command {
  public name: string;
  public aliases: string[];
  public user?: {
    permissions: string[];
  };
  public client?: {
    permissions: string[];
  };
  public description?: string;
  public timeout?: number;
  public usage?: string;
  constructor(opts: Options) {
    const { name, aliases, timeout, description, usage, user, client } = opts;
    this.name = name ?? "";
    this.aliases = aliases ?? [""];
    this.timeout = timeout ?? 3000;
    this.description = description ?? "";
    this.usage = usage ?? "";
    this.user = user ?? { permissions: [""] };
    this.client = client ?? { permissions: [""] };
  }
}

export interface CommandType {
  name: string;
  aliases: string[];
  timeout?: number;
  description?: string;
  usage?: string;
  user?: {
    permissions: string[];
  };
  client?: {
    permissions: string[];
  };
  run: Run;
}

interface Options {
  name: string;
  aliases: string[];
  timeout?: number;
  description?: string;
  usage?: string;
  user?: {
    permissions: string[];
  };
  client?: {
    permissions: string[];
  };
}
