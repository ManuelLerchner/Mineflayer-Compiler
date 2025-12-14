"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskNode = void 0;
const chalk_1 = __importDefault(require("chalk"));
const vec3_1 = require("vec3");
class TaskNode {
    constructor(action, description, ...params) {
        this.action = action;
        this.description = description;
        this.params = [];
        this.params = params;
    }
    getStateName() {
        return this.action + ": '" + this.description + ": " + this.formatParameters(this.params);
    }
    formatParameters(params) {
        let str = params
            .map((param) => {
            if (param instanceof vec3_1.Vec3) {
                return param.toString();
            }
            else {
                return JSON.stringify(param);
            }
        })
            .join(", ");
        return str;
    }
    prettyPrint(indent) {
        let indentation = " ".repeat(indent * 4);
        let str = indentation +
            chalk_1.default.green(this.action + ":") +
            " '" +
            this.description +
            "': " +
            this.formatParameters(this.params);
        return str;
    }
    compile(bot) {
        let action = this.getAction(bot);
        action.setStateName(this.getStateName());
        let possibleErrors = [];
        if (action.canThrowError()) {
            possibleErrors = [action];
        }
        return {
            actions: [action],
            transitions: [],
            possibleErrors,
            enter: action,
            exit: action,
        };
    }
}
exports.TaskNode = TaskNode;
