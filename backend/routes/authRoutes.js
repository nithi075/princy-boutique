import express from "express";
import { phoneLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/phone-login", phoneLogin);

export default router;
