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
exports.MineBlockAction = void 0;
const Action_1 = require("../Action");
class MineBlockAction extends Action_1.Action {
    constructor(bot, pos) {
        super(bot);
        this.pos = pos;
    }
    onStateEntered() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bot.lookAt(this.pos, true);
            let block = this.bot.blockAt(this.pos);
            if (!block) {
                this.setError(new Error("No block found at " + this.pos));
                return;
            }
            if (!this.bot.canDigBlock(block)) {
                this.setError(new Error("Can't dig block at " + this.pos));
                return;
            }
            try {
                yield this.bot.dig(block);
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
exports.MineBlockAction = MineBlockAction;
