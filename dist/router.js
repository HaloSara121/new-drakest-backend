"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const UserController_1 = __importDefault(require("./controllers/UserController"));
const router = (0, express_1.Router)();
exports.router = router;
router.post('/users', UserController_1.default.create);
router.delete('/users/:id', UserController_1.default.delete);
