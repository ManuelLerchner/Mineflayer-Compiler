"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.farmWoodNode = void 0;
const vec3_1 = require("vec3");
const IfNode_1 = require("../Nodes/ASTNodes/StructureNodes/IfNode");
const SequentialNode_1 = require("../Nodes/ASTNodes/StructureNodes/SequentialNode");
const IgnoreErrorNode_1 = require("../Nodes/ASTNodes/SyntacticSugar/IgnoreErrorNode");
const Tasks_1 = require("../Nodes/ASTNodes/Tasks/Tasks");
const NotNode_1 = require("../Nodes/CondtionNodes/Boolean/NotNode");
const FunctionConditionNode_1 = require("../Nodes/CondtionNodes/Condtitions/FunctionConditionNode");
const InventoryConditionNode_1 = require("../Nodes/CondtionNodes/Condtitions/InventoryConditionNode");
const Settings_1 = require("../Settings");
let findTrees = (bot) => {
    return bot.findBlocks({
        maxDistance: 20,
        count: 50,
        matching: (block) => {
            return block.type === Settings_1.mcData.blocksByName["oak_log"].id;
        },
    });
};
let hasAxeWithMoreThan10Durability = new InventoryConditionNode_1.InventoryConditionNode("atleast", 1, "wooden_axe", {
    comparison: "more_than",
    durability: 10,
});
exports.farmWoodNode = new SequentialNode_1.SequentialNode(new IfNode_1.IfNode(new NotNode_1.NotNode(hasAxeWithMoreThan10Durability), new SequentialNode_1.SequentialNode(new Tasks_1.GoToNode("goto axe chests", new vec3_1.Vec3(200, 64, 163)), new Tasks_1.DepositToChestNode("deposit old axe", new vec3_1.Vec3(200, 65, 161), {
    itemName: "wooden_axe",
    amount: "all",
}), new Tasks_1.TakeFromChestNode("take fresh axe", new vec3_1.Vec3(200, 64, 161), {
    itemName: "wooden_axe",
    amount: 1,
}))), new SequentialNode_1.SequentialNode(new Tasks_1.GoToNode("go to center of tree farm", new vec3_1.Vec3(203, 64, 169)), new IfNode_1.IfNode(new FunctionConditionNode_1.FunctionConditionNode("a tree is here", (bot) => findTrees(bot).length > 0), new SequentialNode_1.SequentialNode(new Tasks_1.EquipNode("equip axe", {
    itemName: "wooden_axe",
    place: "hand",
}), new Tasks_1.MineBlocksNode("mine tree", findTrees, {
    itemName: "wooden_axe",
    place: "hand",
}), new Tasks_1.SleepNode("sleep", 2000), new Tasks_1.WalkOverAreaNode("collect items", new vec3_1.Vec3(199, 64, 172), new vec3_1.Vec3(206, 64, 165)), new SequentialNode_1.SequentialNode(new Tasks_1.GoToNode("go to chests", new vec3_1.Vec3(203, 64, 163)), new Tasks_1.DepositToChestNode("deposit sapplings", new vec3_1.Vec3(204, 64, 161), {
    itemName: "oak_sapling",
    amount: "all",
}), new Tasks_1.DepositToChestNode("deposit log", new vec3_1.Vec3(204, 65, 161), {
    itemName: "oak_log",
    amount: "all",
}), new Tasks_1.DepositToChestNode("deposit apple", new vec3_1.Vec3(204, 66, 161), {
    itemName: "apple",
    amount: "all",
}), new Tasks_1.DepositToChestNode("deposit stick", new vec3_1.Vec3(204, 67, 161), {
    itemName: "stick",
    amount: "all",
}), new IfNode_1.IfNode(new InventoryConditionNode_1.InventoryConditionNode("less_than", 4, "oak_sapling"), new Tasks_1.TakeFromChestNode("take sapplings", new vec3_1.Vec3(204, 64, 161), {
    itemName: "oak_sapling",
    amount: 4,
})), new IgnoreErrorNode_1.IgnoreErrorNode(new Tasks_1.PlaceBlockNode("replant sappling 1", "above", new vec3_1.Vec3(204, 63, 167), "oak_sapling"), new Tasks_1.PlaceBlockNode("replant sappling 2", "above", new vec3_1.Vec3(204, 63, 170), "oak_sapling"), new Tasks_1.PlaceBlockNode("replant sappling 3", "above", new vec3_1.Vec3(201, 63, 170), "oak_sapling"), new Tasks_1.PlaceBlockNode("replant sappling 4 ", "above", new vec3_1.Vec3(201, 63, 167), "oak_sapling")))))));
