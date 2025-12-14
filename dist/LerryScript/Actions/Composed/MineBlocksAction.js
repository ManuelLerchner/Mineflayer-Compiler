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
exports.MineBlocksAction = void 0;
const Action_1 = require("../Action");
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
const Settings_1 = require("../../Settings");
class MineBlocksAction extends Action_1.Action {
    constructor(bot, func, equipTask) {
        super(bot);
        this.func = func;
        this.equipTask = equipTask;
    }
    onStateEntered() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let positionsToMine = this.func(this.bot);
                for (let pos of positionsToMine) {
                    let block = this.bot.blockAt(pos);
                    if (!block) {
                        throw new Error("No block at " + pos);
                    }
                    let targetGoal = new mineflayer_pathfinder_1.goals.GoalXZ(pos.x, pos.z);
                    yield this.bot.pathfinder.goto(targetGoal);
                    let farmItem = Settings_1.mcData.itemsByName[this.equipTask.itemName].id;
                    yield this.bot.equip(farmItem, this.equipTask.place);
                    yield this.bot.lookAt(pos, true);
                    if (!this.bot.canDigBlock(block)) {
                        throw new Error("Cant dig block " + block);
                    }
                    yield this.bot.dig(block);
                }
                this.setFinished();
            }
            catch (err) {
                this.setError(err);
            }
        });
    }
    canThrowError() {
        return true;
    }
}
exports.MineBlocksAction = MineBlocksAction;
