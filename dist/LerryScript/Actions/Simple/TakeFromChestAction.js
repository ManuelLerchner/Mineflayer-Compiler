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
exports.TakeFromChestAction = void 0;
const Action_1 = require("../Action");
const Settings_1 = require("../../Settings");
class TakeFromChestAction extends Action_1.Action {
    constructor(bot, pos, itemsToTake) {
        super(bot);
        this.pos = pos;
        this.itemName = itemsToTake.itemName;
        this.amount = itemsToTake.amount;
        if (!this.itemName || !Settings_1.mcData.itemsByName[this.itemName]) {
            throw new Error("No item found with name " + this.itemName + " in " + JSON.stringify(itemsToTake));
        }
    }
    onStateEntered() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bot.lookAt(this.pos, true);
            let chestBlock = this.bot.blockAt(this.pos);
            if (!chestBlock || chestBlock.displayName !== "Chest") {
                this.setError(new Error("No chest found at " + this.pos));
                return;
            }
            let chest = yield this.bot.openChest(chestBlock);
            let item = Settings_1.mcData.itemsByName[this.itemName];
            let takeAmount = this.amount;
            if (takeAmount === "all") {
                takeAmount = chest.count(item.id, null);
            }
            try {
                yield chest.withdraw(item.id, item.metadata, takeAmount);
            }
            catch (e) {
                chest.close();
                this.setError(e);
                return;
            }
            this.setFinished();
            chest.close();
        });
    }
    canThrowError() {
        return true;
    }
}
exports.TakeFromChestAction = TakeFromChestAction;
