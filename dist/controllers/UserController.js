"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../database/models/User"));
const UserController = {
    create: async (req, res) => {
        const { name, email } = req.body;
        const response = await User_1.default.create({
            name,
            email
        });
        res.json({
            response
        });
    },
    delete: async (req, res) => {
        const { id } = req.params;
        const response = await User_1.default.destroy({
            where: {
                id
            },
            force: true
        });
        res.json({
            response
        });
    }
};
exports.default = UserController;
