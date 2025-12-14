"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceBlockNode = exports.WalkOverAreaNode = exports.TakeFromChestNode = exports.ClickInventoryNode = exports.ActivateHotbarIconNode = exports.IdleNode = exports.ChatNode = exports.CallNode = exports.EquipNode = exports.DepositToChestNode = exports.MineBlocksNode = exports.MineBlockNode = exports.SleepNode = exports.GoToNode = void 0;
const TaskNode_1 = require("../StructureNodes/TaskNode");
const DepositToChestAction_1 = require("../../../Actions/Simple/DepositToChestAction");
const EquipAction_1 = require("../../../Actions/Simple/EquipAction");
const GoToAction_1 = require("../../../Actions/Simple/GoToAction");
const IdleAction_1 = require("../../../Actions/Simple/IdleAction");
const SleepAction_1 = require("../../../Actions/Simple/SleepAction");
const TakeFromChestAction_1 = require("../../../Actions/Simple/TakeFromChestAction");
const CallAction_1 = require("../../../Actions/Simple/CallAction");
const ChatAction_1 = require("../../../Actions/Simple/ChatAction");
const ActivateHotbarIconAction_1 = require("../../../Actions/Simple/ActivateHotbarIconAction");
const ClickInventoryAction_1 = require("../../../Actions/Simple/ClickInventoryAction");
const MineBlocksAction_1 = require("../../../Actions/Composed/MineBlocksAction");
const MineBlockAction_1 = require("../../../Actions/Simple/MineBlockAction");
const WalkOverAreaAction_1 = require("../../../Actions/Composed/WalkOverAreaAction");
const PlaceBlockAction_1 = require("../../../Actions/Composed/PlaceBlockAction");
class GoToNode extends TaskNode_1.TaskNode {
    constructor(description, position) {
        super("goto", description, position);
        this.position = position;
    }
    getAction(bot) {
        return new GoToAction_1.GoToAction(bot, this.position);
    }
}
exports.GoToNode = GoToNode;
class SleepNode extends TaskNode_1.TaskNode {
    constructor(description, millis) {
        super("sleep", description, millis);
        this.millis = millis;
    }
    getAction(bot) {
        return new SleepAction_1.SleepAction(bot, this.millis);
    }
}
exports.SleepNode = SleepNode;
class MineBlockNode extends TaskNode_1.TaskNode {
    constructor(description, blockPos) {
        super("mineBlock", description, blockPos);
        this.blockPos = blockPos;
    }
    getAction(bot) {
        return new MineBlockAction_1.MineBlockAction(bot, this.blockPos);
    }
}
exports.MineBlockNode = MineBlockNode;
class MineBlocksNode extends TaskNode_1.TaskNode {
    constructor(description, positionFunction, equipTask) {
        super("mineBlocks", description, positionFunction);
        this.positionFunction = positionFunction;
        this.equipTask = equipTask;
    }
    getAction(bot) {
        return new MineBlocksAction_1.MineBlocksAction(bot, this.positionFunction, this.equipTask);
    }
}
exports.MineBlocksNode = MineBlocksNode;
class DepositToChestNode extends TaskNode_1.TaskNode {
    constructor(description, chestPos, task) {
        super("depositToChest", description, chestPos, task);
        this.chestPos = chestPos;
        this.task = task;
    }
    getAction(bot) {
        return new DepositToChestAction_1.DepositToChestAction(bot, this.chestPos, this.task);
    }
}
exports.DepositToChestNode = DepositToChestNode;
class EquipNode extends TaskNode_1.TaskNode {
    constructor(description, equipTask) {
        super("equip", description, equipTask);
        this.equipTask = equipTask;
    }
    getAction(bot) {
        return new EquipAction_1.EquipAction(bot, this.equipTask);
    }
}
exports.EquipNode = EquipNode;
class CallNode extends TaskNode_1.TaskNode {
    constructor(description, func) {
        super("call", description, func);
        this.func = func;
    }
    getAction(bot) {
        return new CallAction_1.CallAction(bot, this.func);
    }
}
exports.CallNode = CallNode;
class ChatNode extends TaskNode_1.TaskNode {
    constructor(description, chatMessage) {
        super("chat", description, chatMessage);
        this.chatMessage = chatMessage;
    }
    getAction(bot) {
        return new ChatAction_1.ChatAction(bot, this.chatMessage);
    }
}
exports.ChatNode = ChatNode;
class IdleNode extends TaskNode_1.TaskNode {
    constructor(description) {
        super("idle", description);
    }
    getAction(bot) {
        return new IdleAction_1.IdleAction(bot);
    }
}
exports.IdleNode = IdleNode;
class ActivateHotbarIconNode extends TaskNode_1.TaskNode {
    constructor(description, slot) {
        super("activateHotbarIcon", description, slot);
        this.slot = slot;
    }
    getAction(bot) {
        return new ActivateHotbarIconAction_1.ActivateHotbarIconAction(bot, this.slot);
    }
}
exports.ActivateHotbarIconNode = ActivateHotbarIconNode;
class ClickInventoryNode extends TaskNode_1.TaskNode {
    constructor(description, button, slot) {
        super("clickInventory", description, slot);
        this.button = button;
        this.slot = slot;
    }
    getAction(bot) {
        return new ClickInventoryAction_1.ClickInventoryAction(bot, this.button, this.slot);
    }
}
exports.ClickInventoryNode = ClickInventoryNode;
class TakeFromChestNode extends TaskNode_1.TaskNode {
    constructor(description, chestPos, takeTask) {
        super("takeFromChest", description, chestPos, takeTask);
        this.chestPos = chestPos;
        this.takeTask = takeTask;
    }
    getAction(bot) {
        return new TakeFromChestAction_1.TakeFromChestAction(bot, this.chestPos, this.takeTask);
    }
}
exports.TakeFromChestNode = TakeFromChestNode;
class WalkOverAreaNode extends TaskNode_1.TaskNode {
    constructor(description, corner1, corner2) {
        super("walkOverArea", description, corner1, corner2);
        this.corner1 = corner1;
        this.corner2 = corner2;
    }
    getAction(bot) {
        return new WalkOverAreaAction_1.WalkOverAreaAction(bot, this.corner1, this.corner2);
    }
}
exports.WalkOverAreaNode = WalkOverAreaNode;
class PlaceBlockNode extends TaskNode_1.TaskNode {
    constructor(description, placeDirection, referencePos, itemName) {
        super("placeBlock", description, placeDirection, referencePos, itemName);
        this.placeDirection = placeDirection;
        this.referencePos = referencePos;
        this.itemName = itemName;
    }
    getAction(bot) {
        return new PlaceBlockAction_1.PlaceBlockAction(bot, this.placeDirection, this.referencePos, this.itemName);
    }
}
exports.PlaceBlockNode = PlaceBlockNode;
