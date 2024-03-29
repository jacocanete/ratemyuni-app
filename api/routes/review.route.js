import express from "express";
import { create, read } from "../controllers/review.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", create);
router.get("/read", read);

export default router;
