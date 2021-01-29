import { Run } from "../Interfaces/ClientInterfaces";

export class Event {
  public name: string;
  
  constructor(opts: Options) {
    const { name } = opts;
    this.name = name ?? "";
  }
}

export interface EventType {
  name: string;
  run: Run;
}

interface Options {
  name: string;
}
