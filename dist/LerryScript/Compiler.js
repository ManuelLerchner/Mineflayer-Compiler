"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const chalk_1 = __importDefault(require("chalk"));
function compile(rootNode, bot) {
    let program = rootNode.compile(bot);
    console.log("\n" + rootNode.prettyPrint(0));
    console.log(chalk_1.default.green("\nCompilation successful!"));
    if (program.possibleErrors.length > 0) {
        console.log(chalk_1.default.yellow("\nUncaught Error(s) could occure in:"));
        program.possibleErrors.forEach((error) => {
            console.log("    " + chalk_1.default.red(error.stateName));
        });
        console.log(chalk_1.default.yellow("This could cause the bot to remain stuck in the failed state.\nYou can surround the failed state with a 'try' statement to catch such errors.\n"));
    }
    return program;
}
exports.compile = compile;
