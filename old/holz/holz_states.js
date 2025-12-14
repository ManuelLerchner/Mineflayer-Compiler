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
exports.GoToRandom = exports.Failure = exports.EmptyInventory = exports.LeereInvErweitert = exports.SucheHolz = exports.HoleItemAusKiste = exports.Vorbereiten = void 0;
const vec3_1 = require("vec3");
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
const states_1 = require("../_classes/states");
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
class Vorbereiten {
    //endregion
    //region Konsturktoren
    constructor(bot, statename, minDurability, minSaplings) {
        this.done = false;
        this.stateName = '';
        this.minDurability = -1;
        this.minSaplings = -1;
        this.noAxe = false;
        this.noSapling = false;
        this.bot = bot;
        this.active = false;
        this.stateName = statename;
        this.minDurability = minDurability;
        this.minSaplings = minSaplings;
    }
    //endregion
    //region Axt/Sapling überprüfen
    checkAxe() {
        return __awaiter(this, void 0, void 0, function* () {
            const mcData = require('minecraft-data')(this.bot.version);
            let Axe = this.bot.inventory.items().filter(item => item.name === "iron_axe");
            let pItem = mcData.itemsByName.iron_axe;
            if (Axe.length != 0) {
                let remaining = pItem.maxDurability - Axe[0].durabilityUsed;
                if (remaining <= this.minDurability) {
                    this.noAxe = true;
                    return;
                }
                yield this.bot.equip(Axe[0], 'hand', (res) => {
                    if (res) {
                        // Fehler keine Picke wird gefunden
                        this.noAxe = true;
                    }
                    else {
                        this.noAxe = false;
                    }
                });
            }
            else {
                this.noAxe = true;
            }
            return;
        });
    }
    checkSaplings() {
        return __awaiter(this, void 0, void 0, function* () {
            const mcData = require('minecraft-data')(this.bot.version);
            let saplingArray = this.bot.inventory.items().filter(item => (item.name == "oak_sapling" || item.name == "birch_sapling"
                || item.name == "spruce_sapling" || item.name == "jungle_sapling" || item.name == "acacia_sapling" || item.name == "dark_oak_sapling"));
            if (saplingArray.length != 0) {
                for (let index = 0; index < saplingArray.length; index++) {
                    let sapling = saplingArray[index];
                    if (sapling.count < this.minSaplings) {
                        this.noSapling = true;
                    }
                    else {
                        this.noSapling = false;
                        break;
                    }
                }
            }
            else {
                this.noSapling = true;
            }
            return;
        });
    }
    //endregion
    //region Entered/Exited-Events
    onStateEntered() {
        return __awaiter(this, void 0, void 0, function* () {
            this.done = false;
            yield this.checkAxe();
            if (!this.noAxe) {
                yield this.checkSaplings();
                if (!this.noSapling) {
                    this.done = true;
                    return;
                }
            }
            this.done = true;
            return;
        });
    }
    ;
    onStateExited() {
        this.done = false;
        this.noAxe = false;
    }
    ;
    //endregion
    //region Getter
    Done() {
        return this.done;
    }
    NoAxe() {
        return this.noAxe;
    }
    NoSapling() {
        return this.noSapling;
    }
}
exports.Vorbereiten = Vorbereiten;
;
class HoleItemAusKiste {
    //endregion
    //region Konstruktoren
    constructor(bot, statename, itemArray, anzahl, vecKiste) {
        this.active = false;
        this.stateName = '';
        this.anzahl = -1;
        this.done = false;
        this.success = false;
        this.bot = bot;
        this.active = false;
        this.stateName = statename;
        this.itemArray = itemArray;
        this.anzahl = anzahl;
        this.vecKiste = vecKiste;
    }
    //endregion
    //region Entered/Exited-Events
    onStateEntered() {
        return __awaiter(this, void 0, void 0, function* () {
            this.done = false;
            this.success = false;
            const mcData = require('minecraft-data')(this.bot.version);
            yield delay(1000);
            var chestToOpen = this.bot.blockAt(this.vecKiste);
            let chest;
            chest = yield this.bot.openChest(chestToOpen);
            chest = yield this.bot.openChest(chestToOpen);
            Sprung1: {
                for (let index = 0; index < this.itemArray.length; index++) {
                    let itemElement = mcData.itemsByName[this.itemArray[index]];
                    let AllItems = chest.containerItems();
                    let filteredItems = AllItems.filter((item) => item.name === itemElement.name); // containerItems
                    for (let index2 = 0; index2 < filteredItems.length; index2++) {
                        if (filteredItems[index2].count >= this.anzahl) {
                            yield chest.withdraw(mcData.itemsByName[itemElement.name].id, null, this.anzahl).then(() => {
                                this.success = true;
                            })
                                .catch((res) => {
                                if (res) {
                                    this.success = false;
                                }
                            });
                            if (this.success) {
                                break Sprung1;
                            }
                        }
                    }
                }
            }
            chest.close();
            this.done = true;
            return;
        });
    }
    ;
    onStateExited() {
        this.done = false;
        this.success = false;
    }
    ;
    //endregion
    //region Getter
    Done() {
        return this.done;
    }
    Sucess() {
        return this.success;
    }
}
exports.HoleItemAusKiste = HoleItemAusKiste;
;
class SucheHolz {
    //endregion
    //region Konstruktoren
    constructor(bot, statename, baumhoehe) {
        this.done = false;
        this.error = false;
        this.NoSapling = false;
        this.saplingArray = ["oak_sapling", "birch_sapling", "spruce_sapling", "jungle_sapling", "acacia_sapling", "dark_oak_sapling"];
        this.woodArray = ["oak_log", "birch_log", "spruce_log", "jungle_log", "acacia_log", "dark_oak_log"];
        this.bot = bot;
        this.active = false;
        this.stateName = statename;
        this.baumhoehe = baumhoehe;
    }
    //endregion
    //region Methoden
    BaumAbbauen(position) {
        return __awaiter(this, void 0, void 0, function* () {
            const mcData = require('minecraft-data')(this.bot.version);
            let defaultMove = new mineflayer_pathfinder_1.Movements(this.bot, mcData);
            defaultMove.blocksCantBreak = new Set();
            defaultMove.blocksCantBreak.add(mcData.blocksByName.cobblestone_slab.id);
            defaultMove.scafoldingBlocks = [];
            for (let index = 0; index < this.woodArray.length; index++) {
                defaultMove.blocksCantBreak.add(mcData.blocksByName[this.woodArray[index]].id);
            }
            this.bot.pathfinder.setMovements(defaultMove);
            yield this.bot.pathfinder.goto(new mineflayer_pathfinder_1.goals.GoalNear(position.x, this.bot.entity.position.y, position.z, 1)).then((res) => __awaiter(this, void 0, void 0, function* () {
                for (let index = 0; index < this.baumhoehe; index++) {
                    let block = this.bot.blockAt(new vec3_1.Vec3(position.x, position.y + index, position.z));
                    if (block == null)
                        continue;
                    if (this.woodArray.includes(block.name)) {
                        let IronAxe = this.bot.inventory.items().filter(item => item.name == mcData.itemsByName["iron_axe"].name);
                        yield this.bot.equip(IronAxe[0], 'hand');
                        yield this.bot.dig(block, true);
                    }
                    // try {
                    //
                    // } catch (error) {
                    //     this.error = true;
                    // }
                }
            }));
        });
    }
    SetzeSapling(position) {
        return __awaiter(this, void 0, void 0, function* () {
            const mcData = require('minecraft-data')(this.bot.version);
            yield this.bot.pathfinder.goto(new mineflayer_pathfinder_1.goals.GoalNear(position.x, this.bot.entity.position.y, position.z, 1), () => __awaiter(this, void 0, void 0, function* () {
                let Saplings = this.bot.inventory.items().filter(item => this.saplingArray.includes(item.name));
                this.bot.equip(Saplings[0], 'hand', (res) => __awaiter(this, void 0, void 0, function* () {
                    if (res) {
                        this.NoSapling = true;
                    }
                    else {
                        this.NoSapling = false;
                        position = position.offset(0, 1, 0);
                        yield this.bot.lookAt(position);
                        let SaplingToSet = this.bot.blockAt(position);
                        if (SaplingToSet != null) {
                            yield this.bot.placeBlock(SaplingToSet, new vec3_1.Vec3(0, -1, 2));
                        }
                    }
                }));
                //Sapling muss gesetzt werden
            }));
        });
    }
    FindeHolz() {
        return __awaiter(this, void 0, void 0, function* () {
            const mcData = require('minecraft-data')(this.bot.version);
            const ids = [mcData.blocksByName["dirt"].id];
            let dirtblocks = this.bot.findBlocks({ matching: ids, maxDistance: 50, count: 50 });
            //Jeder DirtBlock
            for (let index = 0; index < dirtblocks.length; index++) {
                let position = dirtblocks[index];
                let array = [0, 1, 2, 3, 4, 5, 6];
                //Alle Blöcke auf Holz untersuchen
                let BlockToPlace = this.bot.blockAt(dirtblocks[index].offset(0, 1, 0));
                if (BlockToPlace != null) {
                    if (!this.woodArray.includes(BlockToPlace.name) && !this.saplingArray.includes(BlockToPlace.name)) {
                        //Pflanze Sapling
                        yield this.SetzeSapling(position);
                    }
                    else if (this.woodArray.includes(BlockToPlace.name)) {
                        for (let variable of array) {
                            let positionWithOffset = position.offset(0, variable, 0);
                            let possibleWoodBlock = this.bot.blockAt(positionWithOffset);
                            if (possibleWoodBlock != null) {
                                yield this.BaumAbbauen(possibleWoodBlock.position);
                                yield delay(4000);
                                yield this.SetzeSapling(position);
                                break;
                            }
                        }
                    }
                }
            }
        });
    }
    //endregion
    //region Entered/exited-Events
    onStateEntered() {
        return __awaiter(this, void 0, void 0, function* () {
            this.done = false;
            //await this.FindeHolz();
            yield delay(2000);
            this.done = true;
        });
    }
    ;
    onStateExited() {
        this.done = false;
    }
    ;
    //endregion
    //region Getter
    Done() {
        return this.done;
    }
    Error() {
        return this.error;
    }
}
exports.SucheHolz = SucheHolz;
class LeereInvErweitert {
    //endregion
    //region Konstruktoren
    constructor(bot, vec, statename, minDurability, minSaplings) {
        this.noAxe = false;
        this.saplingChestEmpty = false;
        this.axeChestEmpty = false;
        this.outputChestFull = false;
        this.done = false;
        this.bot = bot;
        this.vec = vec;
        this.active = false;
        this.stateName = statename;
        this.minDurability = minDurability;
        this.minSaplings = minSaplings;
    }
    //endregion
    //region Methods
    checkAxe() {
        return __awaiter(this, void 0, void 0, function* () {
            const mcData = require('minecraft-data')(this.bot.version);
            let Axe = this.bot.inventory.items().filter(item => item.name === "iron_axe");
            let pItem = mcData.itemsByName.iron_axe;
            if (Axe.length != 0) {
                let remainingDurability = pItem.maxDurability - Axe[0].durabilityUsed;
                if (remainingDurability <= this.minDurability) {
                    this.noAxe = true;
                    return;
                }
                yield this.bot.equip(Axe[0], 'hand', (res) => {
                    if (res) {
                        // Fehler keine Picke wird gefunden
                        this.noAxe = true;
                        return;
                    }
                    else {
                        this.noAxe = false;
                        return;
                    }
                });
            }
            else {
                this.noAxe = true;
            }
            return;
        });
    }
    depositSpecialItems(chestToOpen) {
        return __awaiter(this, void 0, void 0, function* () {
            this.outputChestFull = false;
            this.axeChestEmpty = false;
            this.saplingChestEmpty = false;
            const mcData = require('minecraft-data')(this.bot.version);
            const chest = yield this.bot.openChest(chestToOpen);
            let items = this.bot.inventory.items();
            let axeItem = mcData.itemsByName.iron_axe;
            let saplingArray = ["oak_sapling", "birch_sapling", "spruce_sapling", "jungle_sapling", "acacia_sapling", "dark_oak_sapling"];
            let SaplingImInventar = false;
            for (const item of items) {
                //Axt im Inventar gefunden
                if (item.name === axeItem.name) {
                    let remainingDurability = axeItem.maxDurability - item.durabilityUsed;
                    if (remainingDurability < this.minDurability) {
                        yield chest.deposit(item.type, null, 1).catch((res) => {
                            this.outputChestFull = true;
                        });
                    }
                }
                //Sapling im Inventar gefunden
                else if (saplingArray.includes(item.name)) {
                    if (SaplingImInventar) {
                        yield chest.deposit(item.type, null, item.count).catch((res) => {
                            this.outputChestFull = true;
                        });
                    }
                    else {
                        if (item.count > this.minSaplings) {
                            yield chest.deposit(item.type, null, (item.count - this.minSaplings)).catch((res) => {
                                this.outputChestFull = true;
                            });
                            SaplingImInventar = true;
                        }
                    }
                }
                else {
                    yield chest.deposit(item.type, null, item.count).catch((res) => {
                        this.outputChestFull = true;
                    });
                }
            }
        });
    }
    //endregion
    //region Entered/Exited-Events
    onStateEntered() {
        this.done = false;
        this.outputChestFull = false;
        var chestToOpen = this.bot.blockAt(this.vec);
        this.bot.lookAt(chestToOpen.position).then(() => __awaiter(this, void 0, void 0, function* () {
            this.checkAxe();
            yield this.depositSpecialItems(chestToOpen);
        }));
        this.done = true;
    }
    ;
    onStateExited() {
        this.done = false;
        this.outputChestFull = false;
    }
    ;
    //endregion
    //region Getter
    ChestFull() {
        return this.outputChestFull;
    }
    Done() {
        return this.done;
    }
    SaplingChestEmpty() {
        return this.saplingChestEmpty;
    }
    AxeChestEmpty() {
        return this.axeChestEmpty;
    }
    NoAxe() {
        return this.noAxe;
    }
    OutputChestFull() {
        return this.outputChestFull;
    }
}
exports.LeereInvErweitert = LeereInvErweitert;
class EmptyInventory extends states_1.StateParent {
    //endregion
    constructor(bot, vec, stateName, minDurability, minSaplings) {
        super(bot, stateName);
        this.done = false;
        this.chestFull = false;
        this.vec = vec;
        this.minDurability = minDurability;
        this.minSaplings = minSaplings;
        this.Reset();
    }
    Reset() {
        this.done = false;
        this.chestFull = false;
    }
    depositAllValidItems(chestToOpen) {
        return __awaiter(this, void 0, void 0, function* () {
            //Überschreiben, If-Verschachtelung falsch, muss erneuert werden
            this.Reset();
            let chest = yield this.bot.openChest(chestToOpen);
            let items = this.bot.inventory.items();
            const mcData = require('minecraft-data')(this.bot.version);
            let axeItem = mcData.itemsByName.iron_axe;
            let SaplingImInventar = false;
            const saplingArray = ["oak_sapling", "birch_sapling", "spruce_sapling", "jungle_sapling", "acacia_sapling", "dark_oak_sapling"];
            for (const item of items) {
                if (item != null) {
                    //Axt im Inventar gefunden
                    if (item.name === axeItem.name) {
                        let remainingDurability = axeItem.maxDurability - item.durabilityUsed;
                        if (remainingDurability < this.minDurability) {
                            yield chest.deposit(item.type, null, 1, (err) => {
                                if (err != undefined && err != null) {
                                    this.chestFull = true;
                                }
                                return;
                            });
                        }
                    }
                    //Sapling im Inventar gefunden
                    else if (saplingArray.includes(item.name)) {
                        if (SaplingImInventar) {
                            yield chest.deposit(item.type, null, item.count, (err) => {
                                if (err != undefined && err != null) {
                                    this.chestFull = true;
                                }
                                return;
                            });
                        }
                        else {
                            if (item.count > this.minSaplings) {
                                yield chest.deposit(item.type, null, item.count - this.minSaplings, (err) => {
                                    if (err != undefined && err != null) {
                                        this.chestFull = true;
                                    }
                                    return;
                                });
                                SaplingImInventar = true;
                            }
                        }
                    }
                    else {
                        yield chest.deposit(item.type, null, item.count, (err) => {
                            if (err != undefined && err != null) {
                                this.chestFull = true;
                            }
                            return;
                        });
                    }
                }
            }
            yield delay(1500);
            chest.close();
            this.done = true;
            return;
        });
    }
    onStateEntered() {
        this.Reset();
        let chestToOpen = this.bot.blockAt(this.vec);
        if (chestToOpen != null) {
            this.bot.lookAt(chestToOpen.position).then(() => __awaiter(this, void 0, void 0, function* () {
                if (chestToOpen != null)
                    yield this.depositAllValidItems(chestToOpen);
            }));
        }
    }
    ;
    onStateExited() {
        this.Reset();
    }
    ;
    IsChestFull() {
        return this.chestFull;
    }
    IsDone() {
        return this.done;
    }
}
exports.EmptyInventory = EmptyInventory;
class Failure {
    //endregion
    //region Konstruktor
    constructor(bot, statename, text) {
        this.text = "";
        this.bot = bot;
        this.active = false;
        this.stateName = statename;
        this.text = text;
    }
    //endregion
    //region Entered/Existed-Event
    onStateEntered() {
        //this.bot.chat("FEHLER: " + this.text);
    }
    ;
    onStateExited() {
        //this.bot.chat("Fehler behoben:"+this.text);
    }
    ;
}
exports.Failure = Failure;
class GoToRandom extends states_1.StateParent {
    constructor(bot, stateName) {
        super(bot, stateName);
        this.done = false;
        this.doExit = false;
        this.Reset();
    }
    GoTo(position) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bot.pathfinder.goto(new mineflayer_pathfinder_1.goals.GoalNear(position.x, position.y, position.z, 3), () => __awaiter(this, void 0, void 0, function* () {
                this.done = true;
                return;
            }));
        });
    }
    getRandom(min, max) {
        return __awaiter(this, void 0, void 0, function* () {
            return Math.random() * (max - min) + min;
        });
    }
    onStateEntered() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Reset();
            const mcData = require('minecraft-data')(this.bot.version);
            const ids = [mcData.blocksByName["dirt"].id];
            const DirtBlocks = this.bot.findBlocks({ matching: ids, maxDistance: 50, count: 50 });
            // Checken ob irgendwo ein Air Block über dem Dirt ist
            for (let index = 0; index < DirtBlocks.length; index++) {
                let BlockToPlace = this.bot.blockAt(DirtBlocks[index].offset(0, 1, 0));
                if (BlockToPlace != null && (BlockToPlace.name == ("air") || BlockToPlace.name.includes("_log"))) {
                    this.doExit = true;
                    break;
                }
                else if (BlockToPlace != null) {
                    this.doExit = false;
                }
            }
            if (!this.doExit) {
                let rand = yield this.getRandom(0, DirtBlocks.length - 1);
                yield this.GoTo(DirtBlocks[Math.trunc(rand)]);
            }
            this.done = true;
        });
    }
    ;
    Reset() {
        this.done = false;
        this.doExit = false;
    }
    onStateExited() {
        this.Reset();
    }
    ;
    IsDone() {
        return this.done;
    }
    DoExit() {
        return this.doExit;
    }
}
exports.GoToRandom = GoToRandom;
