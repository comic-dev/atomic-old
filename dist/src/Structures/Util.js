"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
var Badges;
(function (Badges) {
    Badges["BRAVERY"] = "<:bbravery:818083760142417922>";
    Badges["GOLDENBUG"] = "<:bgoldenbug:818083760221585419>";
    Badges["EVENTS"] = "<:bevents:818083760284893226>";
    Badges["BALANCE"] = "<:bbalancee:818083760301801492>";
    Badges["EARLY"] = "<:bearly:818083760348069938>";
    Badges["BRILLIANCE"] = "<:bbrilliance:818083760380706826>";
    Badges["BUGHUNTER"] = "<:bbughunter:818083760398401546>";
    Badges["PARTNER"] = "<:bpartner:818083760435232788>";
    Badges["VERIFIEDDEV"] = "<:bverifieddev:818083760440082432>";
    Badges["STAFF"] = "<:bstaff:818083760499064872>";
    Badges["VERIFIEDBOT"] = "<:bverifiedbot:818083760645734430>";
})(Badges || (Badges = {}));
class Util {
    static normalize(str) {
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
    static trim(str, max = 10) {
        return str.length > max
            ? `${str.slice(0, max).join(", ")} and ${str.length - max} more...`
            : `${str.join(", ")}`;
    }
    static status(status) {
        if (status.length === 3) {
            return `Do Not Disturb`;
        }
        else {
            return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        }
    }
    static capitalize(str) {
        if (str.includes(" ")) {
            return str
                .split(" ")
                .map((v) => {
                v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
            })
                .join(" ");
        }
        else {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }
    }
    static badges(str) {
        return str
            .map((v) => {
            switch (v) {
                case "DISCORD_EMPLOYEE":
                    return Badges.STAFF;
                case "PARTNERED_SERVER_OWNER":
                    return Badges.PARTNER;
                case "DISCORD_PARTNER":
                    return Badges.PARTNER;
                case "HYPESQUAD_EVENTS":
                    return Badges.EVENTS;
                case "BUGHUNTER_LEVEL_1":
                    return Badges.BUGHUNTER;
                case "HOUSE_BRAVERY":
                    return Badges.BRAVERY;
                case "HOUSE_BRILLIANCE":
                    return Badges.BRILLIANCE;
                case "HOUSE_BALANCE":
                    return Badges.BRILLIANCE;
                case "EARLY_SUPPORTER":
                    return Badges.EARLY;
                case "TEAM_USER":
                    return Badges.STAFF;
                case "SYSTEM":
                    return "System";
                case "BUGHUNTER_LEVEL_2":
                    return Badges.GOLDENBUG;
                case "VERIFIED_BOT":
                    return Badges.VERIFIEDBOT;
                case "VERIFIED_DEVELOPER":
                    return Badges.VERIFIEDDEV;
            }
        })
            .filter((v) => !!v);
    }
}
exports.Util = Util;
//# sourceMappingURL=Util.js.map