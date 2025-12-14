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
exports.ActivateHotbarIconAction = void 0;
const Action_1 = require("../Action");
class ActivateHotbarIconAction extends Action_1.Action {
    constructor(bot, hotbarIdx) {
        super(bot);
        this.hotbarIdx = hotbarIdx;
    }
    onStateEntered() {
        return __awaiter(this, void 0, void 0, function* () {
            this.bot.setQuickBarSlot(this.hotbarIdx);
            this.bot.activateItem();
            this.setFinished();
        });
    }
    canThrowError() {
        return false;
    }
}
exports.ActivateHotbarIconAction = ActivateHotbarIconAction;
