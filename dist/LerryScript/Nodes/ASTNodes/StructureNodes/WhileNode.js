"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhileNode = void 0;
const chalk_1 = __importDefault(require("chalk"));
const Transitions_1 = require("../../../Transitions/Transitions");
const IdentityAction_1 = require("./../../../Actions/Simple/IdentityAction");
class WhileNode {
    constructor(condition, body) {
        this.condition = condition;
        this.body = body;
    }
    prettyPrint(indent) {
        let indentation = " ".repeat(indent * 4);
        let str = "";
        str += indentation + chalk_1.default.yellow("while (\n");
        str += this.condition.prettyPrint(indent + 1) + "\n";
        str += indentation + chalk_1.default.yellow(") do {\n");
        str += this.body.prettyPrint(indent + 1) + "\n";
        str += indentation + chalk_1.default.yellow("}");
        return str;
    }
    createInternalStates(bot, compiledBody) {
        let startWhile = new IdentityAction_1.IdentityAction(bot);
        startWhile.setStateName("While-Node:" + this.condition.getName());
        let endWhile = new IdentityAction_1.IdentityAction(bot);
        endWhile.setStateName("End While-Node");
        let input = compiledBody.enter;
        let output = compiledBody.exit;
        let enterLoop = (0, Transitions_1.createTransition)(startWhile, input, this.condition.getCondition(bot), "Enter Loop");
        let returnFromLoop = (0, Transitions_1.createTransition)(startWhile, endWhile, () => !this.condition.getCondition(bot)(), "Exit while");
        let loop = (0, Transitions_1.createTransition)(output, startWhile, output.isFinished, "Return from Loop");
        let internalActions = [startWhile, endWhile];
        let internalTransitions = [enterLoop, loop, returnFromLoop];
        return {
            internalActions,
            internalTransitions,
            enter: startWhile,
            exit: endWhile,
        };
    }
    compile(bot) {
        let compiledBody = this.body.compile(bot);
        let { internalActions, internalTransitions, enter, exit } = this.createInternalStates(bot, compiledBody);
        let actions = [...internalActions, ...compiledBody.actions];
        let transitions = [...internalTransitions, ...compiledBody.transitions];
        let canThrowError = compiledBody.possibleErrors;
        return {
            actions,
            transitions,
            possibleErrors: canThrowError,
            enter,
            exit,
        };
    }
}
exports.WhileNode = WhileNode;
