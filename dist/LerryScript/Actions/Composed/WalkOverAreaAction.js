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
exports.WalkOverAreaAction = void 0;
const vec3_1 = require("vec3");
const Action_1 = require("../Action");
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
class WalkOverAreaAction extends Action_1.Action {
    constructor(bot, corner1, corner2) {
        super(bot);
        this.corner1 = corner1;
        this.corner2 = corner2;
        this.goals = [];
        let blocksToCover = this.calculatePath();
        for (let pos of blocksToCover) {
            this.goals.push(new mineflayer_pathfinder_1.goals.GoalBlock(pos.x, pos.y, pos.z));
        }
    }
    onStateEntered() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (let goal of this.goals) {
                    yield this.bot.pathfinder.goto(goal, () => { });
                }
                this.setFinished();
            }
            catch (err) {
                console.log(err);
                this.setError(err);
            }
        });
    }
    calculatePath() {
        let x1 = Math.min(this.corner1.x, this.corner2.x);
        let x2 = Math.max(this.corner1.x, this.corner2.x);
        let y1 = Math.min(this.corner1.y, this.corner2.y);
        let y2 = Math.max(this.corner1.y, this.corner2.y);
        let z1 = Math.min(this.corner1.z, this.corner2.z);
        let z2 = Math.max(this.corner1.z, this.corner2.z);
        let positionsToCover = [];
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                positionsToCover.push(new vec3_1.Vec3(x, y, z1));
                positionsToCover.push(new vec3_1.Vec3(x, y, z2));
                let tmp = z1;
                z1 = z2;
                z2 = tmp;
            }
        }
        return positionsToCover;
    }
    canThrowError() {
        return true;
    }
}
exports.WalkOverAreaAction = WalkOverAreaAction;
