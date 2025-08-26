//This is the main entrance of the backend (express lift)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import videosRoutes from "./modules/videos/videos.routes.js";
import cloudinary from "./cloudinary.js";
import searchVideos from "./modules/search/search.routes.js";

dotenv.config();
cloudinary.config();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json()); // To handle JSON in requests

// Routes
app.use("/videos", videosRoutes);
app.use("/search", searchVideos);

// Start the server
app.listen(3000, () => {
    console.log("Server running on the port: http://localhost:3000");
});