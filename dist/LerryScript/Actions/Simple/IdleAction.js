"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdleAction = void 0;
const Action_1 = require("../Action");
class IdleAction extends Action_1.Action {
    constructor(bot) {
        super(bot);
    }
    onStateEntered() { }
    canThrowError() {
        return false;
    }
}
exports.IdleAction = IdleAction;
