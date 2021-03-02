import { Listener } from "discord-akairo";
export default class ReadyEvent extends Listener {
  public constructor() {
    super("ready", {
      emitter: "client",
      event: "ready",
      category: "client",
    });
  }

  public exec(): void {
    console.log(`[${this.client.user.username}] Connected to Discord Gateway`);
  }
}
