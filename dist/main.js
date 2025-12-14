"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mineflayer_1 = require("mineflayer");
const Simulator_1 = require("../src/LerryScript/Simulator");
const SequentialNode_1 = require("./LerryScript/Nodes/ASTNodes/StructureNodes/SequentialNode");
const TryNode_1 = require("./LerryScript/Nodes/ASTNodes/StructureNodes/TryNode");
const WhileNode_1 = require("./LerryScript/Nodes/ASTNodes/StructureNodes/WhileNode");
const Tasks_1 = require("./LerryScript/Nodes/ASTNodes/Tasks/Tasks");
const FunctionConditionNode_1 = require("./LerryScript/Nodes/CondtionNodes/Condtitions/FunctionConditionNode");
const bot = (0, mineflayer_1.createBot)({
    host: "localhost",
    username: "LerryBot",
});
let rootNode = new WhileNode_1.WhileNode(new FunctionConditionNode_1.FunctionConditionNode("infinite repeat", () => true), new TryNode_1.TryNode(new SequentialNode_1.SequentialNode(new Tasks_1.IdleNode("")), new Tasks_1.SleepNode("sleep", 5000)));
(0, Simulator_1.simulate)(rootNode, bot);
