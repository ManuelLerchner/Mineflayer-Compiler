"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryNode = void 0;
const chalk_1 = __importDefault(require("chalk"));
const Transitions_1 = require("../../../Transitions/Transitions");
const IdentityAction_1 = require("../../../Actions/Simple/IdentityAction");
class TryNode {
    constructor(task, error) {
        this.task = task;
        this.error = error;
    }
    prettyPrint(indent) {
        let indentation = " ".repeat(indent * 4);
        let str = "";
        str += indentation + chalk_1.default.cyan("try (\n");
        str += this.task.prettyPrint(indent + 1) + "\n";
        str += indentation + chalk_1.default.cyan(") onError {\n");
        str += this.error.prettyPrint(indent + 1) + "\n";
        str += indentation + chalk_1.default.cyan("}\n");
        return str;
    }
    createInternalStates(bot, compiledTask, compiledError) {
        let startTry = new IdentityAction_1.IdentityAction(bot);
        startTry.setStateName("Try-Node");
        let endTry = new IdentityAction_1.IdentityAction(bot);
        endTry.setStateName("End Try-Node");
        let taskEnter = compiledTask.enter;
        let errorEnter = compiledError.enter;
        let taskExit = compiledTask.exit;
        let errorExit = compiledError.exit;
        let enterTask = (0, Transitions_1.createTransition)(startTry, taskEnter, () => true, "Enter Task");
        let leaveTask = (0, Transitions_1.createTransition)(taskExit, endTry, taskExit.isFinished, "Exit from Task");
        let enterErrors = [];
        for (let child of compiledTask.actions) {
            if (!child.errorChaught && child.canThrowError()) {
                enterErrors.push((0, Transitions_1.createTransition)(child, errorEnter, () => child.isErrored(), "Enter Error"));
                child.errorChaught = true;
            }
        }
        let leaveError = (0, Transitions_1.createTransition)(errorExit, endTry, errorExit.isFinished, "Exit from Error");
        let internalActions = [startTry, endTry];
        let internalTransitions = [
            enterTask,
            leaveTask,
            ...enterErrors,
            leaveError,
        ];
        return {
            internalActions,
            internalTransitions,
            enter: startTry,
            exit: endTry,
        };
    }
    compile(bot) {
        let compiledTask = this.task.compile(bot);
        let compiledError = this.error.compile(bot);
        let internal = this.createInternalStates(bot, compiledTask, compiledError);
        let actions = [
            ...internal.internalActions,
            ...compiledTask.actions,
            ...compiledError.actions,
        ];
        let transitions = [
            ...internal.internalTransitions,
            ...compiledTask.transitions,
            ...compiledError.transitions,
        ];
        let canThrowError = compiledError.possibleErrors;
        return {
            actions,
            transitions,
            possibleErrors: canThrowError,
            enter: internal.enter,
            exit: internal.exit,
        };
    }
}
exports.TryNode = TryNode;
