"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../database/models/User"));
const UserController = {
    index: async (req, res) => {
        const response = await User_1.default.findAll();
        res.status(200).json({
            response
        });
    },
    create: async (req, res) => {
        const { name, email } = req.body;
        const user = await User_1.default.findOne({
            where: {
                email
            }
        });
        const userEmail = user?.dataValues.email;
        if (userEmail !== email) {
            const response = await User_1.default.create({
                name,
                email
            });
            return res.status(201).json({
                response
            });
        }
        res.status(400).json({
            error: "user already exists"
        });
    },
    update: async (req, res) => {
        const { id } = req.params;
        const valuesToUpdate = req.body;
        const user = await User_1.default.findOne({
            where: {
                id
            }
        });
        if (user) {
            const response = await User_1.default.update({
                ...valuesToUpdate
            }, {
                where: {
                    id
                }
            });
            return res.status(200).json({
                response
            });
        }
        res.status(404).json({
            error: "User not found"
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
        if (response === 1) {
            res.status(200).json({
                success: "user has been deleted"
            });
        }
        res.status(404).json({
            error: "User not found"
        });
    }
};
exports.default = UserController;
