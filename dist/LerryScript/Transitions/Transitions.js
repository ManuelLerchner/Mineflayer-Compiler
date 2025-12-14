"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransition = void 0;
const mineflayer_statemachine_1 = require("mineflayer-statemachine");
function createTransition(from, to, func, name) {
    return new mineflayer_statemachine_1.StateTransition({
        parent: from,
        child: to,
        shouldTransition: func,
        name,
    });
}
exports.createTransition = createTransition;
