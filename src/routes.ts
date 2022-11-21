import { Router } from "express";

import UserController from "./controllers/UserController";
import CharacterController from "./controllers/CharacterController";

const router = Router()

// Users
router.get('/users', UserController.index)
router.post('/users', UserController.create)
router.put('/users/:id', UserController.update)
router.delete('/users/:id', UserController.delete)

// Characters
router.get('/characters', CharacterController.index)
router.get('/users/:userId/characters', CharacterController.index)
router.post('/users/:userId/characters', CharacterController.create)
router.put('/characters/:characterId', CharacterController.update)
router.delete('/characters/:characterId', CharacterController.delete)

// Rooms

export { router }