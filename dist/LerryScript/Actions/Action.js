"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const chalk_1 = __importDefault(require("chalk"));
const Settings_1 = require("../Settings");
class Action {
    constructor(bot) {
        this.bot = bot;
        this.active = false;
        this.stateName = "No-State";
        this.finished = false;
        this.error = false;
        this.errorChaught = false;
        this.reset = this.reset.bind(this);
        this.isFinished = this.isFinished.bind(this);
        this.setFinished = this.setFinished.bind(this);
        this.setError = this.setError.bind(this);
        this.isErrored = this.isErrored.bind(this);
        this.onStateExited = this.onStateExited.bind(this);
    }
    setStateName(stateName) {
        this.stateName = stateName;
    }
    reset() {
        this.finished = false;
        this.error = false;
    }
    setFinished() {
        this.finished = true;
    }
    isFinished() {
        return this.finished;
    }
    setError(err) {
        if (Settings_1.PRINT_ERROR) {
            console.log(chalk_1.default.red("\n" + err.name + ": " + err.message + " in: '" + this.stateName + "'"));
        }
        this.error = true;
    }
    isErrored() {
        return this.error;
    }
    onStateExited() {
        if (Settings_1.PRINT_STATES) {
            console.log(chalk_1.default.green("\n" + this.stateName + " finished"));
        }
        this.reset();
    }
}
exports.Action = Action;
