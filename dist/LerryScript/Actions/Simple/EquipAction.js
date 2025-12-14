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
exports.EquipAction = void 0;
const Action_1 = require("../Action");
const Settings_1 = require("../../Settings");
class EquipAction extends Action_1.Action {
    constructor(bot, equipTask) {
        super(bot);
        this.itemName = equipTask.itemName;
        this.place = equipTask.place;
        if (!this.itemName || !Settings_1.mcData.itemsByName[this.itemName]) {
            "No item found with name " + this.itemName + " in " + JSON.stringify(equipTask);
        }
    }
    onStateEntered() {
        return __awaiter(this, void 0, void 0, function* () {
            let itemNr = Settings_1.mcData.itemsByName[this.itemName].id;
            try {
                yield this.bot.equip(itemNr, this.place);
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
exports.EquipAction = EquipAction;
