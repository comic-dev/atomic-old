import { Atomic } from "./Structures/Atomic";
import * as Config from "../config.json";

export const Client: Atomic = new Atomic({ ...Config }).boot();