"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequentialNode = void 0;
const chalk_1 = __importDefault(require("chalk"));
const Transitions_1 = require("../../../Transitions/Transitions");
const IdentityAction_1 = require("../../../Actions/Simple/IdentityAction");
class SequentialNode {
    constructor(child, ...children) {
        this.children = [child, ...children];
    }
    prettyPrint(indent) {
        let indentation = " ".repeat(indent * 4);
        let str = "";
        str += indentation + chalk_1.default.blue("{\n");
        for (let action of this.children) {
            str += action.prettyPrint(indent + 1) + "\n";
        }
        str += indentation + chalk_1.default.blue("}");
        return str;
    }
    createInternalStates(bot, compiledChildren) {
        let startSequential = new IdentityAction_1.IdentityAction(bot);
        startSequential.setStateName("Sequential-Node");
        let endSequential = new IdentityAction_1.IdentityAction(bot);
        endSequential.setStateName("End Sequential-Node");
        let taskEnter = compiledChildren[0].enter;
        let taskExit = compiledChildren[compiledChildren.length - 1].exit;
        let enterTask = (0, Transitions_1.createTransition)(startSequential, taskEnter, () => true, "Enter Sequential-Node");
        let leaveTask = (0, Transitions_1.createTransition)(taskExit, endSequential, taskExit.isFinished, "Exit from Sequential-Node");
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
        let compiledChildren = this.children.map((action) => action.compile(bot));
        let { internalActions: actions, internalTransitions: transitions, enter, exit, } = this.createInternalStates(bot, compiledChildren);
        for (let i = 0; i < compiledChildren.length - 1; i++) {
            let curr = compiledChildren[i];
            let next = compiledChildren[i + 1];
            let from = curr.exit || curr.actions[curr.actions.length - 1];
            let to = next.enter || next.actions[0];
            transitions.push((0, Transitions_1.createTransition)(from, to, from.isFinished, "Action finsihed"));
        }
        for (let action of compiledChildren) {
            actions = actions.concat(action.actions);
            transitions = transitions.concat(action.transitions);
        }
        let possibleErrors = compiledChildren
            .map((c) => c.possibleErrors)
            .reduce((a, b) => a.concat(b), []);
        return {
            actions,
            transitions,
            possibleErrors,
            enter,
            exit,
        };
    }
}
exports.SequentialNode = SequentialNode;
