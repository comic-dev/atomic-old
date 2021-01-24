import { Atomic } from "./Structures/Atomic";
import { config } from "dotenv";
export const client: Atomic = new Atomic().init(config(), [
  "Commands",
  "Events",
]);
