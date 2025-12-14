"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrNode = void 0;
const chalk_1 = __importDefault(require("chalk"));
class OrNode {
    constructor(node, ...nodes) {
        this.orNodes = [node, ...nodes];
    }
    prettyPrint(indent) {
        let indentation = " ".repeat(indent * 4);
        let str = indentation + chalk_1.default.gray("or [\n");
        this.orNodes.forEach((node) => {
            str += node.prettyPrint(indent + 1) + ",\n";
        });
        str += indentation + chalk_1.default.gray("]");
        return str;
    }
    getCondition(bot) {
        return () => this.orNodes.some((andNode) => andNode.getCondition(bot)());
    }
    getName() {
        return this.orNodes.map((node) => node.getName()).join(" or ");
    }
}
exports.OrNode = OrNode;
