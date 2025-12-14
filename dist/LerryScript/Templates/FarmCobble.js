"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.farmCobbleNode = void 0;
const vec3_1 = require("vec3");
const IfNode_1 = require("../Nodes/ASTNodes/StructureNodes/IfNode");
const SequentialNode_1 = require("../Nodes/ASTNodes/StructureNodes/SequentialNode");
const TryNode_1 = require("../Nodes/ASTNodes/StructureNodes/TryNode");
const WhileNode_1 = require("../Nodes/ASTNodes/StructureNodes/WhileNode");
const Tasks_1 = require("../Nodes/ASTNodes/Tasks/Tasks");
const AndNode_1 = require("../Nodes/CondtionNodes/Boolean/AndNode");
const NotNode_1 = require("../Nodes/CondtionNodes/Boolean/NotNode");
const InventoryConditionNode_1 = require("../Nodes/CondtionNodes/Condtitions/InventoryConditionNode");
let hasPickaxeWithMoreThan10Durability = new InventoryConditionNode_1.InventoryConditionNode("atleast", 1, "wooden_pickaxe", {
    comparison: "more_than",
    durability: 10,
});
exports.farmCobbleNode = new SequentialNode_1.SequentialNode(new IfNode_1.IfNode(new NotNode_1.NotNode(hasPickaxeWithMoreThan10Durability), new SequentialNode_1.SequentialNode(new Tasks_1.GoToNode("chests", new vec3_1.Vec3(217, 64, 173)), new Tasks_1.DepositToChestNode("used wooden pickaxe", new vec3_1.Vec3(219, 64, 171), {
    itemName: "wooden_pickaxe",
    amount: "all",
}), new TryNode_1.TryNode(new Tasks_1.TakeFromChestNode("take pickaxe", new vec3_1.Vec3(219, 64, 173), {
    itemName: "wooden_pickaxe",
    amount: 1,
}), new Tasks_1.SleepNode("because there no pickaxe in chest", 5000)))), new SequentialNode_1.SequentialNode(new Tasks_1.EquipNode("wooden_pickaxe to hand", {
    itemName: "wooden_pickaxe",
    place: "hand",
}), new Tasks_1.GoToNode("cobble farm", new vec3_1.Vec3(214, 64, 181)), new WhileNode_1.WhileNode(new AndNode_1.AndNode(new InventoryConditionNode_1.InventoryConditionNode("atmost", 5, "cobblestone"), hasPickaxeWithMoreThan10Durability), new SequentialNode_1.SequentialNode(new Tasks_1.MineBlockNode("cobble 1", new vec3_1.Vec3(215, 65, 181)), new Tasks_1.MineBlockNode("cobble 2", new vec3_1.Vec3(214, 65, 180)))), new Tasks_1.ChatNode("enough cobble", "I have enough cobble"), new Tasks_1.GoToNode("chests", new vec3_1.Vec3(217, 64, 173)), new TryNode_1.TryNode(new Tasks_1.DepositToChestNode("all cobblestone", new vec3_1.Vec3(219, 64, 175), {
    itemName: "cobblestone",
    amount: "all",
}), new Tasks_1.IdleNode("because chest is full"))));
