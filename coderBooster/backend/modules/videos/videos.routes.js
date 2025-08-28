// Express endpoints
// define the endpoints and connect them with the controller.

import express from "express";
import multer from "multer";
import path from "path";
import {
    createVideo,
    getAllVideosController,
    updateVideoController,
    deleteVideoController
} from "./videos.controller.js";

const router = express.Router();


// Multer configuration to receive the file
const upload = multer({ 
    dest: path.join(process.cwd(), "uploads/"), // Use absolute path
    fileFilter: (req, file, cb) => {
        // Log file info for debugging
        console.log('File received:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        });
        
        // Validate file type - be more permissive
        const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/quicktime'];
        const allowedExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.qt'];
        
        // Check mimetype first
        if (allowedTypes.includes(file.mimetype)) {
            console.log('File accepted by mimetype:', file.mimetype);
            return cb(null, true);
        }
        
        // Check file extension as fallback
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(fileExtension)) {
            console.log('File accepted by extension:', fileExtension);
            return cb(null, true);
        }
        
        console.log('File rejected - mimetype:', file.mimetype, 'extension:', fileExtension);
        cb(new Error('Invalid file type. Only video files are allowed.'), false);
    },
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

// Error handling middleware for Multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 100MB.' });
        }
        return res.status(400).json({ error: 'File upload error: ' + error.message });
    }
    
    if (error.message === 'Invalid file type. Only video files are allowed.') {
        return res.status(400).json({ error: 'Invalid file type. Only video files are allowed.' });
    }
    
    next(error);
};

// Endpoints
router.post("/create", upload.single("file"), createVideo);
router.get("/", getAllVideosController);
router.put("/:id", upload.single("file"), updateVideoController);
router.delete("/:id", deleteVideoController);

export default router;
