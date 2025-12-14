"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndNode = void 0;
const chalk_1 = __importDefault(require("chalk"));
class AndNode {
    constructor(node, ...nodes) {
        this.andNodes = [node, ...nodes];
    }
    prettyPrint(indent) {
        let indentation = " ".repeat(indent * 4);
        let str = indentation + chalk_1.default.gray("and [\n");
        this.andNodes.forEach((node) => {
            str += node.prettyPrint(indent + 1) + ",\n";
        });
        str += indentation + chalk_1.default.gray("]");
        return str;
    }
    getCondition(bot) {
        return () => this.andNodes.every((andNode) => andNode.getCondition(bot)());
    }
    getName() {
        return this.andNodes.map((node) => node.getName()).join(" and ");
    }
}
exports.AndNode = AndNode;
