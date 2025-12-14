"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulate = void 0;
const mineflayer_statemachine_1 = require("mineflayer-statemachine");
const Compiler_1 = require("./Compiler");
const Settings_1 = require("./Settings");
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
const autoeat = require("mineflayer-auto-eat");
const inventoryViewer = require("mineflayer-web-inventory");
function simulate(rootNode, bot) {
    bot.loadPlugin(mineflayer_pathfinder_1.pathfinder);
    bot.loadPlugin(autoeat);
    let program = (0, Compiler_1.compile)(rootNode, bot);
    let webserver = null;
    startBot(bot, program, webserver);
}
exports.simulate = simulate;
function startBot(bot, program, webserver) {
    bot.on("spawn", () => {
        const NSM = new mineflayer_statemachine_1.NestedStateMachine(program.transitions, program.enter);
        const stateMachine = new mineflayer_statemachine_1.BotStateMachine(bot, NSM);
        // const movements = new Movements(bot, mcData);
        // movements.scafoldingBlocks.push(mcData.itemsByName["oak_log"].id);
        // bot.pathfinder.setMovements(movements);
        if (!webserver) {
            webserver = new mineflayer_statemachine_1.StateMachineWebserver(bot, stateMachine);
            inventoryViewer(bot, {
                port: 8935,
                startOnLoad: true,
            });
            webserver.startServer();
            console.log("Started inventory server at http://localhost:8935.");
        }
    });
    if (Settings_1.ENABLE_BOT_DEBUG) {
        bot.on("spawn", () => {
            bot.chat("DEBUG MODE: ON");
        });
        bot.on("error", (err) => {
            console.log(err);
        });
        bot.on("chat", (username, message) => __awaiter(this, void 0, void 0, function* () {
            if (message === "drop items") {
                for (let item of bot.inventory.items()) {
                    yield bot.tossStack(item);
                }
            }
            if (message === "food") {
                bot.chat(bot.food.toString());
            }
            if (message === "health") {
                bot.chat(bot.health.toString());
            }
        }));
    }
}
