import express from 'express';
import {getAllTasks, createTask,updateTask ,deleteTask} from '../controllers/tasksControllers.js'

const router = express();

router.get("/", getAllTasks)
router.post("/", createTask)

router.put("/:id", updateTask)

router.delete("/:id", deleteTask)

export default router;