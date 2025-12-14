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
const vec3_1 = require("vec3");
const mineflayer_statemachine_1 = require("mineflayer-statemachine");
//region MineFlayer Creation
mineflayer_statemachine_1.globalSettings.debugMode = true;
const holz_states_1 = require("./holz_states");
const states_1 = require("../_classes/states");
const discordhelper_1 = require("../_classes/discordhelper");
const stateShare_1 = require("../_classes/stateShare");
const mineFlayer = require('mineflayer');
const bot = mineFlayer.createBot({
    username: 'Holzer',
    host: ""
});
bot.loadPlugin(require('mineflayer-pathfinder').pathfinder);
//endregion
//Discord-Bot hinzufügen
const helper = new discordhelper_1.DiscordHelper(bot, "", "");
bot.once("spawn", () => __awaiter(void 0, void 0, void 0, function* () {
    //region States
    //region Serverconnect
    const printServerStates = new mineflayer_statemachine_1.BehaviorPrintServerStats(bot);
    //const compassPort: CompassPort = new CompassPort(bot, "compassPort", 2);
    //const goToIsland: GoToIsland = new GoToIsland(bot, "goToIsland", 29);
    //endregion
    const mindurability = 50;
    const minSaplings = 32;
    const state_idle = new mineflayer_statemachine_1.BehaviorIdle();
    const state_goToCenter = new states_1.GotoXYZ(bot, new vec3_1.Vec3(128, 99, -74), "goToCenter");
    const state_vorbereiten = new holz_states_1.Vorbereiten(bot, "Vorbereiten", mindurability, minSaplings);
    const state_HoleAxt = new holz_states_1.HoleItemAusKiste(bot, "Axt holen", ["iron_axe"], 1, new vec3_1.Vec3(130, 99, -74));
    const state_HoleSapling = new holz_states_1.HoleItemAusKiste(bot, "Sapling holen", ["oak_sapling", "birch_sapling", "spruce_sapling", "jungle_sapling", "acacia_sapling", "dark_oak_sapling"], 64, new vec3_1.Vec3(130, 99, -73));
    //const state_sucheHolz = new SucheHolz(bot, "suche Holz", 6);
    // temporärer State für neue Implementierung
    const state_middleIdle = new mineflayer_statemachine_1.BehaviorIdle();
    let share = new stateShare_1.stateShare(null);
    const state_SearchDirt = new states_1.SearchDirt(bot, "state_SearchDirt", 50, share);
    const state_GoToDirt = new states_1.GotoSharedData(bot, "state_GoToDirt", share);
    const state_DecideAction = new states_1.DecideAction(bot, "state_DecideAction", share);
    const state_CutTree = new states_1.CutTree(bot, "state_CutTree", share);
    const state_PlantSapling = new states_1.PlantSapling(bot, "state_PlantSapling", share);
    const state_emptyItems = new holz_states_1.EmptyInventory(bot, new vec3_1.Vec3(130, 99, -75), "emptyItems", mindurability, minSaplings);
    const state_GoToRandom = new holz_states_1.GoToRandom(bot, "state_GoToRandom");
    //endregion
    //region Error-States
    const errorstate_axe = new states_1.Failure(bot, "ErrorState_Axe", "Axt konnte nicht genommen werden");
    const errorstate_sapling = new states_1.Failure(bot, "Errorstate_Sapling", "Sapling konnte nicht genommen werden");
    //const errorstate_axeAndSapling=new Failure(bot,"Errorstate_AxeAndSapling","Axt und sapling konnten nicht genommen werden");
    const errorstate_emptyItemsFailed = new states_1.Failure(bot, "Errorstate_EmptyItemsFailed", "Items konnten nicht geleert werden");
    const errorstate_NoDecision = new states_1.Failure(bot, "errorstate_NoDecision", "Keine Entscheidung konnte getroffen werden");
    //endregion
    const transitions = [
        new mineflayer_statemachine_1.StateTransition({
            parent: printServerStates,
            child: state_idle,
            name: 'Idle-State ',
            shouldTransition: () => true
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_idle,
            child: state_goToCenter,
            name: 'GotoCenter ',
            shouldTransition: () => true
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_goToCenter,
            child: state_vorbereiten,
            name: 'vorbereiten',
            shouldTransition: () => (state_goToCenter.hasReached())
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_emptyItems,
            child: state_GoToRandom,
            name: 'Gehe zu Random',
            shouldTransition: () => (state_emptyItems.IsDone() && !state_emptyItems.IsChestFull())
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_GoToRandom,
            child: state_GoToRandom,
            name: 'Bleibe bei GeheZuRandom',
            shouldTransition: () => (state_GoToRandom.IsDone() && !state_GoToRandom.DoExit())
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_GoToRandom,
            child: state_middleIdle,
            name: 'Idle',
            shouldTransition: () => (state_GoToRandom.IsDone() && state_GoToRandom.DoExit())
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_emptyItems,
            child: errorstate_emptyItemsFailed,
            name: 'Fehlerzustand entleeren',
            shouldTransition: () => (state_emptyItems.IsDone() && state_emptyItems.IsChestFull())
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_vorbereiten,
            child: state_GoToRandom,
            name: 'gehe Random',
            shouldTransition: () => state_vorbereiten.Done() && !state_vorbereiten.NoAxe() && !state_vorbereiten.NoSapling()
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_vorbereiten,
            child: state_HoleAxt,
            name: 'Hole Axt',
            shouldTransition: () => state_vorbereiten.Done() && state_vorbereiten.NoAxe() && !state_vorbereiten.NoSapling()
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_vorbereiten,
            child: state_HoleSapling,
            name: 'Hole Sapling',
            shouldTransition: () => state_vorbereiten.Done() && !state_vorbereiten.NoAxe() && state_vorbereiten.NoSapling()
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_HoleSapling,
            child: state_vorbereiten,
            name: 'erneut Vorbereiten',
            shouldTransition: () => state_HoleSapling.Done() && state_HoleSapling.Sucess()
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_HoleAxt,
            child: state_vorbereiten,
            name: 'erneut Vorbereiten',
            shouldTransition: () => state_HoleAxt.Done() && state_HoleAxt.Sucess()
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_HoleAxt,
            child: errorstate_axe,
            name: 'Axt konnte nicht geholt werden',
            shouldTransition: () => state_HoleAxt.Done() && !state_HoleAxt.Sucess()
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_HoleSapling,
            child: errorstate_sapling,
            name: 'Sapling konnte nicht geholt werden',
            shouldTransition: () => state_HoleSapling.Done() && !state_HoleSapling.Sucess()
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_middleIdle,
            child: state_SearchDirt,
            name: '',
            shouldTransition: () => true
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_SearchDirt,
            child: state_GoToDirt,
            name: '',
            shouldTransition: () => state_SearchDirt.Done() && state_SearchDirt.Found()
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_SearchDirt,
            child: state_goToCenter,
            name: '',
            shouldTransition: () => state_SearchDirt.Done() && !state_SearchDirt.Found()
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_GoToDirt,
            child: state_DecideAction,
            name: '',
            shouldTransition: () => state_GoToDirt.hasReached()
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_DecideAction,
            child: state_CutTree,
            name: '',
            shouldTransition: () => state_DecideAction.Done() && state_DecideAction.Abbauen()
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_DecideAction,
            child: state_PlantSapling,
            name: '',
            shouldTransition: () => state_DecideAction.Done() && state_DecideAction.Setzen()
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_PlantSapling,
            child: state_goToCenter,
            name: '',
            shouldTransition: () => state_PlantSapling.Done()
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_CutTree,
            child: state_goToCenter,
            name: '',
            shouldTransition: () => state_CutTree.Done()
        }),
        new mineflayer_statemachine_1.StateTransition({
            parent: state_DecideAction,
            child: errorstate_NoDecision,
            name: '',
            shouldTransition: () => state_DecideAction.Done() && !state_DecideAction.Abbauen() && !state_DecideAction.Setzen()
        }),
    ];
    const root = new mineflayer_statemachine_1.NestedStateMachine(transitions, printServerStates);
    const stateMachine = new mineflayer_statemachine_1.BotStateMachine(bot, root);
    const webserver = new mineflayer_statemachine_1.StateMachineWebserver(bot, stateMachine);
    webserver.startServer();
}));
