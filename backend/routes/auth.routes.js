import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
  refreshAccessToken
} from "../controllers/auth.controller.js";

import authMiddleware
from "../middleware/auth.middleware.js";

const router =
  express.Router();

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);
router.post(
  "/refresh",
  refreshAccessToken
);
export default router;