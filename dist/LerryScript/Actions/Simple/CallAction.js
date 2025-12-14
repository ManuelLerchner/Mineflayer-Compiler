"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallAction = void 0;
const Action_1 = require("../Action");
class CallAction extends Action_1.Action {
    constructor(bot, func) {
        super(bot);
        this.func = func;
    }
    onStateEntered() {
        this.func();
        this.setFinished();
    }
    canThrowError() {
        return false;
    }
}
exports.CallAction = CallAction;
