import { Router } from "express";

import UserController from "./controllers/UserController";
import CharacterController from "./controllers/CharacterController";
import AuthController from "./controllers/AuthController";
import checkToken from "./middlewares/checkToken";

const router = Router();

// Auth
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/auth/validate", checkToken, AuthController.validate);

// Users
router.get("/users", checkToken, UserController.index);
router.get("/users/:id", checkToken, UserController.get);
// router.post("/users", UserController.create);
router.put("/users/:id", UserController.update);
router.delete("/users/:id", UserController.delete);

// Characters
router.get("/characters", CharacterController.index);
router.get("/users/:userId/characters", CharacterController.index);
router.post("/users/:userId/characters", CharacterController.create);
router.put("/characters/:characterId", CharacterController.update);
router.delete("/characters/:characterId", CharacterController.delete);

// Rooms

export { router };
