import express from 'express';

import tasksRoute from './routes/tasksRoutes.js'
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from "cors"
dotenv.config();

const PORT = process.env.PORT || 5001

const app = express();


app.use(express.json());// middleware level 1 chuyen du lieu tu json thanh obj cho de xu ly

app.use(cors({origin:"http://localhost:5173"}));

app.use("/api/tasks",tasksRoute);

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Cổng bắt đầu trên cổng ${PORT}`)
    })
})


