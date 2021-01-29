import { Run } from "../Interfaces/ClientInterfaces";
import Chalk from "chalk";
import { Event } from "../Structures/Event";
import { Atomic } from "../Structures/Atomic";
export default class ReadyEvent extends Event {
  constructor(){
    super({
      name: 'ready'
    });
  };

  public async run(client: Atomic) {
    client.logger.log(
      Chalk.bold(
        `${Chalk.grey(`[WS]`)} Connected to Gateway as ${Chalk.cyan(
          client.user.username
        )}`
      )
    );
  }
}