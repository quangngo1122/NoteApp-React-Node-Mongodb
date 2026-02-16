import express from "express";

import tasksRoute from "./routes/tasksRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import path, { dirname } from "path";
dotenv.config();

const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

const app = express();

app.use(express.json()); // middleware level 1 chuyen du lieu tu json thanh obj cho de xu ly

if (process.env.NOTE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.use("/api/tasks", tasksRoute);
if (process.env.NOTE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Cổng bắt đầu trên cổng ${PORT}`);
  });
});
