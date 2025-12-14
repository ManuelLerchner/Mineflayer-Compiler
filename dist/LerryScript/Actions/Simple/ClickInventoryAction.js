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
exports.ClickInventoryAction = void 0;
const Action_1 = require("../Action");
class ClickInventoryAction extends Action_1.Action {
    constructor(bot, button, slotId) {
        super(bot);
        this.button = button;
        this.slotId = slotId;
    }
    onStateEntered() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.button === "left") {
                yield this.bot.simpleClick.leftMouse(this.slotId);
            }
            else if (this.button === "right") {
                yield this.bot.simpleClick.rightMouse(this.slotId);
            }
            this.setFinished();
        });
    }
    canThrowError() {
        return false;
    }
}
exports.ClickInventoryAction = ClickInventoryAction;
