import Task from "../models/Tasks.js";

export const getAllTasks = async (req, res) => {
  const { filter = "today" } = req.query;
  const now = new Date();
  let startDate;

  switch (filter) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case "week": {
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all":
    default: {
      startDate = null;
    }
  }

  const query = startDate ? { createdAt: { $gte: startDate } } : {};

  try {
    // const tasks = await Task.find().sort({ createdAt : -1 }); // lay toan bo du lieu cua Task - co the thay bang desc, asc thay vi 1, -1
    // const activeCount = await Task.countDocuments({status:"active"});
    const result = await Task.aggregate([
      { $match: query },
      {
        $facet: {
          tasks: [
            {
              $sort: { createdAt: -1 },
            },
          ],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completeCount: [
            { $match: { status: "complete" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;

    // res.status(200).json(tasks);
    res.status(200).json({ tasks, activeCount, completeCount });
  } catch (error) {
    console.log("loi khi goi getalltasks", error);
    res.status(500).json({ message: "loi he thong" });
  }
};
export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.log("loi khi goi createTask", error);
    res.status(500).json({ message: "loi he thong" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    const updateTask = await Task.findByIdAndUpdate(
      req.params.id, //id tu url
      {
        // doi tuong muon update
        title,
        status,
        completedAt,
      },
      { new: true }, // tra ve gia tri sau khi update thay vi gia tri trc update
    );
    if (!updateTask) {
      return res.status(404).json({ message: "nhiem vu khong ton tai" });
    }
    res.status(200).json(updateTask);
  } catch (error) {
    console.log("loi khi goi updateTask", error);
    res.status(500).json({ message: "loi he thong" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deleteTask = await Task.findByIdAndDelete(req.params.id);
    if (!deleteTask) {
      return res.status(404).json({ message: "nhiem vu khong ton tai" });
    }
    res.status(200).json(deleteTask);
  } catch (error) {
    console.log("loi khi goi deleteTask", error);
    res.status(500).json({ message: "loi he thong" });
  }
};
