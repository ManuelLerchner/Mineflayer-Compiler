"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionConditionNode = void 0;
class FunctionConditionNode {
    constructor(name, func) {
        this.name = name;
        this.func = func;
    }
    prettyPrint(indent) {
        let indentation = " ".repeat(indent * 4);
        return indentation + this.name;
    }
    getCondition(bot) {
        return () => this.func(bot);
    }
    getName() {
        return this.name;
    }
}
exports.FunctionConditionNode = FunctionConditionNode;
