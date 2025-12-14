"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotNode = void 0;
const chalk_1 = __importDefault(require("chalk"));
class NotNode {
    constructor(node) {
        this.node = node;
    }
    prettyPrint(indent) {
        let indentation = " ".repeat(indent * 4);
        let str = indentation + chalk_1.default.gray("not [\n");
        str += this.node.prettyPrint(indent + 1) + "\n";
        str += indentation + chalk_1.default.gray("]");
        return str;
    }
    getCondition(bot) {
        return () => !this.node.getCondition(bot)();
    }
    getName() {
        return `not ${this.node.getName()}`;
    }
}
exports.NotNode = NotNode;
