"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgnoreErrorNode = void 0;
const chalk_1 = __importDefault(require("chalk"));
const Transitions_1 = require("../../../Transitions/Transitions");
const IdentityAction_1 = require("../../../Actions/Simple/IdentityAction");
class IgnoreErrorNode {
    constructor(child, ...children) {
        this.actions = [child, ...children];
    }
    prettyPrint(indent) {
        let indentation = " ".repeat(indent * 4);
        let str = "";
        str += indentation + chalk_1.default.blue("{\n");
        for (let action of this.actions) {
            str += action.prettyPrint(indent + 1) + "\n";
        }
        str += indentation + chalk_1.default.blue("}");
        return str;
    }
    createInternalStates(bot, compiledChildren) {
        let startSequential = new IdentityAction_1.IdentityAction(bot);
        startSequential.setStateName("IgnoreError-Node");
        let endSequential = new IdentityAction_1.IdentityAction(bot);
        endSequential.setStateName("End IgnoreError-Node");
        let taskEnter = compiledChildren[0].enter;
        let taskExit = compiledChildren[compiledChildren.length - 1].exit;
        let enterTask = (0, Transitions_1.createTransition)(startSequential, taskEnter, () => true, "Enter IgnoreError-Node");
        let leaveTask = (0, Transitions_1.createTransition)(taskExit, endSequential, () => taskExit.isFinished() || taskExit.isErrored(), "Exit from IgnoreError-Node");
        let internalActions = [startSequential, endSequential];
        let internalTransitions = [enterTask, leaveTask];
        return {
            internalActions,
            internalTransitions,
            enter: startSequential,
            exit: endSequential,
        };
    }
    compile(bot) {
        let compiledChildren = this.actions.map((action) => action.compile(bot));
        let { internalActions: actions, internalTransitions: transitions, enter, exit, } = this.createInternalStates(bot, compiledChildren);
        for (let i = 0; i < compiledChildren.length - 1; i++) {
            let curr = compiledChildren[i];
            let next = compiledChildren[i + 1];
            let from = curr.exit || curr.actions[curr.actions.length - 1];
            let to = next.enter || next.actions[0];
            transitions.push((0, Transitions_1.createTransition)(from, to, () => from.isFinished() || from.isErrored(), "Action finsihed or Errored"));
        }
        for (let compResult of compiledChildren) {
            actions = actions.concat(compResult.actions);
            transitions = transitions.concat(compResult.transitions);
        }
        for (let compResult of compiledChildren) {
            for (let childAction of compResult.actions) {
                if (!childAction.errorChaught && childAction.canThrowError()) {
                    childAction.errorChaught = true;
                }
            }
        }
        return {
            actions,
            transitions,
            possibleErrors: [],
            enter,
            exit,
        };
    }
}
exports.IgnoreErrorNode = IgnoreErrorNode;
