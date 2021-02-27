import { GuardFunction } from "@typeit/discord"
import { MessageEmbed, PermissionString } from "discord.js"
export function Permissions(perms: PermissionString[]): GuardFunction<"commandMessage"> {
    const guard: GuardFunction<"commandMessage"> = async([message], client, next) => {
        console.log(guard)
        console.log(message);
        if(message.member.permissions.has(perms, true)) await next();
        else message.channel.send(new MessageEmbed({
            title: "Missing Access",
            description: `You require the ${perms.join(" ")} permission(s) to use the **${message.commandName}** command`
        }))
    }
    return guard;
}