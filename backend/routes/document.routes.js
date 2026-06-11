import express
from "express";

import authMiddleware
from "../middleware/auth.middleware.js";

import upload
from "../middleware/upload.middleware.js";

import {
  uploadDocument,
  askDocument,
  getUserDocuments,
  deleteDocument,
  getDocumentById
} from "../controllers/document.controller.js";

const router =
express.Router();

router.post(
"/upload",
authMiddleware,
upload.single(
"file"
),
uploadDocument
);

router.post(
"/ask/:id",
authMiddleware,
askDocument
);

router.get(
"/my-docs",
authMiddleware,
getUserDocuments
);

router.delete(
  "/delete/:id",
  authMiddleware,
  deleteDocument
);
router.get(
  "/:id",
  authMiddleware,
  getDocumentById
);


export default router;