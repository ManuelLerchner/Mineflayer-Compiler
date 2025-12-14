"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfNode = void 0;
const chalk_1 = __importDefault(require("chalk"));
const Transitions_1 = require("../../../Transitions/Transitions");
const IdentityAction_1 = require("../../../Actions/Simple/IdentityAction");
class IfNode {
    constructor(condition, ifTrue, ifFalse) {
        this.condition = condition;
        this.ifTrue = ifTrue;
        this.ifFalse = ifFalse;
    }
    prettyPrint(indent) {
        let indentation = " ".repeat(indent * 4);
        let str = "";
        str += indentation + chalk_1.default.magenta("if (\n");
        str += this.condition.prettyPrint(indent + 1) + "\n";
        str += indentation + chalk_1.default.magenta(") do {\n");
        str += this.ifTrue.prettyPrint(indent + 1) + "\n";
        if (this.ifFalse) {
            str += indentation + chalk_1.default.magenta("} else {\n");
            str += this.ifFalse.prettyPrint(indent + 1) + "\n";
            str += indentation + chalk_1.default.magenta("}");
        }
        return str;
    }
    createInternalStates(bot, compiledTrueBranch, compiledFalseBranch) {
        let startIf = new IdentityAction_1.IdentityAction(bot);
        startIf.setStateName("If-Node:\n" + this.condition.getName());
        let endIf = new IdentityAction_1.IdentityAction(bot);
        endIf.setStateName("End If-Node");
        let internalActions = [startIf, endIf];
        let internalTransitions = [];
        if (compiledFalseBranch) {
            let gotoFalseBranch = (0, Transitions_1.createTransition)(startIf, compiledFalseBranch.enter, () => !this.condition.getCondition(bot)(), "Enter False Branch");
            let exitIfFromFalse = (0, Transitions_1.createTransition)(compiledFalseBranch.exit, endIf, compiledFalseBranch.exit.isFinished, "Exit False Branch");
            internalTransitions.push(gotoFalseBranch, exitIfFromFalse);
        }
        else {
            let gotoEnd = (0, Transitions_1.createTransition)(startIf, endIf, () => !this.condition.getCondition(bot)(), "Exit If-Node dircetly");
            internalTransitions.push(gotoEnd);
        }
        let gotoTrueBranch = (0, Transitions_1.createTransition)(startIf, compiledTrueBranch.enter, this.condition.getCondition(bot), "Enter True Branch");
        let exitIfFromTrue = (0, Transitions_1.createTransition)(compiledTrueBranch.exit, endIf, compiledTrueBranch.exit.isFinished, "Exit from True Branch");
        internalTransitions.push(gotoTrueBranch, exitIfFromTrue);
        return {
            internalActions,
            internalTransitions,
            enter: startIf,
            exit: endIf,
        };
    }
    compile(bot) {
        let compiledTrueBranch = this.ifTrue.compile(bot);
        let compiledFalseBranch = null;
        if (this.ifFalse) {
            compiledFalseBranch = this.ifFalse.compile(bot);
        }
        let internalLogic = this.createInternalStates(bot, compiledTrueBranch, compiledFalseBranch);
        let actions = [...internalLogic.internalActions, ...compiledTrueBranch.actions];
        let transitions = [...internalLogic.internalTransitions, ...compiledTrueBranch.transitions];
        let canThrowError = compiledTrueBranch.possibleErrors;
        if (compiledFalseBranch) {
            actions = [...actions, ...compiledFalseBranch.actions];
            transitions = [...transitions, ...compiledFalseBranch.transitions];
            canThrowError = [...canThrowError, ...compiledFalseBranch.possibleErrors];
        }
        return {
            actions,
            transitions,
            possibleErrors: canThrowError,
            enter: internalLogic.enter,
            exit: internalLogic.exit,
        };
    }
}
exports.IfNode = IfNode;
