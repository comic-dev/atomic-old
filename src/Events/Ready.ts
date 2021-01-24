import { Run } from "../Interfaces/ClientInterfaces";
import Chalk from "chalk";
export const name: string = "ready";
export const run: Run = async (client) => {
  client.logger.log(
    Chalk.bold(
      `${Chalk.grey(`[WS]`)} Connected to Gateway as ${Chalk.cyan(
        client.user.username
      )}`
    )
  );
};
