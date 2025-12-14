"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryConditionNode = void 0;
const Settings_1 = require("../../../Settings");
class InventoryConditionNode {
    constructor(attribute, amount, itemName, duribailityData) {
        this.attribute = attribute;
        this.amount = amount;
        this.itemName = itemName;
        this.duribailityData = duribailityData;
        if (!Settings_1.mcData.itemsByName[this.itemName]) {
            throw new Error("No item found with name " + itemName);
        }
    }
    prettyPrint(indent) {
        let indentation = " ".repeat(indent * 4);
        return indentation + this.getName();
    }
    inventoryContainsCondition(bot) {
        let invItems = bot.inventory.items().filter((invItem) => invItem.name === this.itemName);
        let itemCount = invItems.map((invItem) => invItem.count).reduce((a, b) => a + b, 0);
        let durabiltyConditionMet = true;
        if (itemCount && this.duribailityData) {
            let durabilityComparison = this.duribailityData.comparison;
            let durabilityValueShould = this.duribailityData.durability;
            let maxDurability = Settings_1.mcData.itemsByName[this.itemName].maxDurability;
            let remaining = maxDurability - invItems[0].durabilityUsed;
            switch (durabilityComparison) {
                case "exactly":
                    durabiltyConditionMet = remaining === durabilityValueShould;
                    break;
                case "more_than":
                    durabiltyConditionMet = remaining > durabilityValueShould;
                    break;
                case "less_than":
                    durabiltyConditionMet = remaining < durabilityValueShould;
                    break;
                case "atleast":
                    durabiltyConditionMet = remaining >= durabilityValueShould;
                    break;
                case "atmost":
                    durabiltyConditionMet = remaining <= durabilityValueShould;
            }
            if (!durabiltyConditionMet) {
                return false;
            }
        }
        switch (this.attribute) {
            case "exactly":
                return itemCount === this.amount;
            case "more_than":
                return itemCount > this.amount;
            case "less_than":
                return itemCount < this.amount;
            case "atleast":
                return itemCount >= this.amount;
            case "atmost":
                return itemCount <= this.amount;
        }
    }
    getCondition(bot) {
        return () => this.inventoryContainsCondition(bot);
    }
    getName() {
        return ("Bot has " +
            this.attribute +
            " " +
            this.amount +
            " " +
            this.itemName +
            (this.duribailityData
                ? " with durability " +
                    this.duribailityData.comparison +
                    " " +
                    this.duribailityData.durability
                : ""));
    }
}
exports.InventoryConditionNode = InventoryConditionNode;
