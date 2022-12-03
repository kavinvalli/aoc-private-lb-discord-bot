"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var dotenv = require("dotenv");
dotenv.config();
if (!process.env.DISCORD_BOT_TOKEN ||
    !process.env.DISCORD_CLIENT_ID ||
    !process.env.SESSION ||
    !process.env.PRIVATE_LEADERBOARD_ID) {
    console.error('Set env variables properly. Copy .env.example into .env and fill all the values.');
    process.exit(1);
}
var DClient = /** @class */ (function (_super) {
    __extends(DClient, _super);
    function DClient() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.commands = new discord_js_1.Collection();
        return _this;
    }
    return DClient;
}(discord_js_1.Client));
var client = new DClient({
    intents: [discord_js_1.GatewayIntentBits.Guilds]
});
client.once(discord_js_1.Events.ClientReady, function (c) {
    console.log("Ready! Logged in as ".concat(c.user.tag));
});
client.commands = new discord_js_1.Collection();
var command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('lb')
        .setDescription('Shows private leaderboard' +
        (process.env.appName ? " of ".concat(process.env.appName) : '')),
    execute: function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var data, members, key, replyEmbed, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("https://adventofcode.com/2022/leaderboard/private/view/".concat(process.env.PRIVATE_LEADERBOARD_ID, ".json"), {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Cookie: 'session=' + process.env.SESSION
                                }
                            })];
                    case 1: return [4 /*yield*/, (_a.sent()).json()];
                    case 2:
                        data = _a.sent();
                        console.log(data);
                        members = [];
                        for (key in data.members) {
                            members.push(data.members[key]);
                        }
                        members.sort(function (a, b) { return b.local_score - a.local_score; });
                        members = members.slice(0, 10);
                        console.log(members.map(function (member) { return member.local_score; }));
                        replyEmbed = new discord_js_1.EmbedBuilder()
                            .setTitle("techCircuit's AOC Leaderboard")
                            .setDescription("Want to view more than the top 10 users? [**Click here**](https://adventofcode.com/2022/leaderboard/private/view/".concat(process.env.PRIVATE_LEADERBOARD_ID, ")\n(you need to be logged in and have joined the leaderboard to view the above link)") +
                            '\n\n' +
                            members
                                .map(function (member, index) {
                                return "**".concat(index + 1, ". ").concat(member.name, " - ").concat(member.local_score, "**");
                            })
                                .join('\n'));
                        interaction.reply({ embeds: [replyEmbed] });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        interaction.reply('Something went wrong');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};
client.on(discord_js_1.Events.InteractionCreate, function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var command, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!interaction.isChatInputCommand())
                    return [2 /*return*/];
                command = interaction.client.commands.get(interaction.commandName);
                if (!command) {
                    console.error("No command matching");
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 5]);
                return [4 /*yield*/, command.execute(interaction)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                error_2 = _a.sent();
                console.error(error_2);
                return [4 /*yield*/, interaction.reply('Something went wrong...')];
            case 4:
                _a.sent();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
client.commands.set('lb', command);
var rest = new discord_js_1.REST({ version: '10' }).setToken((_a = process.env.DISCORD_BOT_TOKEN) !== null && _a !== void 0 ? _a : '');
var commands = client.commands;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                console.log("Started refreshing application (/) commands.");
                console.log(commands.map(function (command) { return command.data.toJSON(); }));
                return [4 /*yield*/, rest.put(discord_js_1.Routes.applicationCommands((_a = process.env.DISCORD_CLIENT_ID) !== null && _a !== void 0 ? _a : ''), { body: commands.map(function (command) { return command.data.toJSON(); }) })];
            case 1:
                _b.sent();
                console.log('Ho gaya shayad');
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
client.login(process.env.DISCORD_BOT_TOKEN);
