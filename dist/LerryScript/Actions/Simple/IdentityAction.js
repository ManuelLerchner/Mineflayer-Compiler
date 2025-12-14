"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityAction = void 0;
const Action_1 = require("../Action");
class IdentityAction extends Action_1.Action {
    constructor(bot) {
        super(bot);
    }
    onStateEntered() {
        this.setFinished();
    }
    canThrowError() {
        return false;
    }
}
exports.IdentityAction = IdentityAction;
