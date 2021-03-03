import { PermissionString } from "discord.js";

export class Util {
  public static normalize(str: string[]): string[] {
    return str.map((s) => {
      return s.includes("_")
        ? s
            .split("_")
            .map((a) => {
              return `${a.charAt(0).toUpperCase()}${a.slice(1).toLowerCase()}`;
            })
            .join(" ")
        : `${s.charAt(0).toUpperCase()}${s.slice(1).toLowerCase()}`;
    });
  }

  public static trim(
    str: string[] | PermissionString[],
    max: number = 10
  ): string {
    return str.length > max
      ? `**${str.slice(0, max).join("**, **")}** and ${
          str.length - max
        } more...`
      : `**${str.join(", ")}**`;
  }
}
