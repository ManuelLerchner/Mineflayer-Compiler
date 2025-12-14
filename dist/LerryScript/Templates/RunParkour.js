"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunParkour = void 0;
const vec3_1 = require("vec3");
const SequentialNode_1 = require("../Nodes/ASTNodes/StructureNodes/SequentialNode");
const Tasks_1 = require("../Nodes/ASTNodes/Tasks/Tasks");
exports.RunParkour = new SequentialNode_1.SequentialNode(new Tasks_1.GoToNode("first pos", new vec3_1.Vec3(208, 64, 180)), new Tasks_1.GoToNode("second pos", new vec3_1.Vec3(204, 64, 182)), new Tasks_1.GoToNode("third pos", new vec3_1.Vec3(200, 64, 180)), new Tasks_1.GoToNode("fourth pos", new vec3_1.Vec3(198, 64, 181)), new Tasks_1.GoToNode("fifth pos", new vec3_1.Vec3(201, 64, 182)), new Tasks_1.GoToNode("sixth pos", new vec3_1.Vec3(204, 64, 180)), new Tasks_1.GoToNode("seventh pos", new vec3_1.Vec3(207, 64, 182)), new Tasks_1.GoToNode("eighth pos", new vec3_1.Vec3(210, 64, 181)));
