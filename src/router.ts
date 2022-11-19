import { Router } from "express";

const router = Router()

router.get('/', (req, res) => res.json({isServerRunning: true}))

export { router }