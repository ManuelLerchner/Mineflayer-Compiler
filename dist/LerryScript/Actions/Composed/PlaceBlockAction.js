"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceBlockAction = void 0;
const vec3_1 = require("vec3");
const Action_1 = require("../Action");
const Settings_1 = require("../../Settings");
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
class PlaceBlockAction extends Action_1.Action {
    constructor(bot, placeDirection, referencePos, itemName) {
        super(bot);
        this.placeDirection = placeDirection;
        this.referencePos = referencePos;
        this.itemName = itemName;
        if (!Settings_1.mcData.itemsByName[this.itemName]) {
            "No item found with name " + this.itemName;
        }
    }
    onStateEntered() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.bot.pathfinder.goto(new mineflayer_pathfinder_1.goals.GoalNear(this.referencePos.x, this.referencePos.y, this.referencePos.z, 4));
                let itemNr = Settings_1.mcData.itemsByName[this.itemName].id;
                yield this.bot.equip(itemNr, "hand");
                let referenceBlock = this.bot.blockAt(this.referencePos);
                if (!referenceBlock) {
                    throw new Error("No Block found at " + this.referencePos);
                }
                let faceVector = this.getFaceVector();
                yield this.bot.placeBlock(referenceBlock, faceVector);
                this.setFinished();
            }
            catch (e) {
                this.setError(e);
            }
        });
    }
    getFaceVector() {
        switch (this.placeDirection) {
            case "above":
                return new vec3_1.Vec3(0, 1, 0);
            case "below":
                return new vec3_1.Vec3(0, -1, 0);
            case "north":
                return new vec3_1.Vec3(0, 0, -1);
            case "south":
                return new vec3_1.Vec3(0, 0, 1);
            case "east":
                return new vec3_1.Vec3(1, 0, 0);
            case "west":
                return new vec3_1.Vec3(-1, 0, 0);
        }
    }
    canThrowError() {
        return true;
    }
}
exports.PlaceBlockAction = PlaceBlockAction;
