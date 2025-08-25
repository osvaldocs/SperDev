// Express endpoints
// define the endpoints and connect them with the controller.

import express from "express";
import multer from "multer";
import {
    createVideo,
    getAllVideosController,
    updateVideoController,
    deleteVideoController
} from "./videos.controller.js";

const router = express.Router();

// Multer configuration to receive the file
const upload = multer({ dest: "uploads/" }); // Temporarily stores the file

// Endpoints
router.post("/create", upload.single("file"), createVideo);
router.get("/", getAllVideosController);
router.put("/:id", upload.single("file"), updateVideoController);
router.delete("/:id", deleteVideoController);

export default router;
