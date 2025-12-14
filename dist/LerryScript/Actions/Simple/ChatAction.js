"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatAction = void 0;
const Action_1 = require("../Action");
class ChatAction extends Action_1.Action {
    constructor(bot, message) {
        super(bot);
        this.message = message;
    }
    onStateEntered() {
        this.bot.chat(this.message);
        this.setFinished();
    }
    canThrowError() {
        return false;
    }
}
exports.ChatAction = ChatAction;
