"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleepAction = void 0;
const Action_1 = require("../Action");
class SleepAction extends Action_1.Action {
    constructor(bot, msSleep) {
        super(bot);
        this.msSleep = msSleep;
    }
    onStateEntered() {
        this.sleep(this.msSleep).then(() => {
            this.setFinished();
        });
    }
    sleep(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
    canThrowError() {
        return false;
    }
}
exports.SleepAction = SleepAction;
