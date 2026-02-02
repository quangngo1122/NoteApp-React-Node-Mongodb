import React, { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import api from "@/lib/axios";

const AddTask = ({ handleNewTaskAdded }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = async () => {
    if (newTaskTitle.trim()) {
      try {
        // await axios.post("http://localhost:5001/api/tasks", {
        //   title: newTaskTitle,
        // });
        await api.post("/tasks", {
          title: newTaskTitle,
        });
        toast.success(`Nhiem vu ${newTaskTitle} da dc them vao`);
        handleNewTaskAdded();
      } catch (error) {
        console.error("loi xay ra khi them task", error);
        toast.error("loi khi them nhiem vu moi");
      }
      setNewTaskTitle("");
    } else {
      toast.error("ban can nhap noi dung cua nhiem vu");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="Cần làm gì"
          value={newTaskTitle}
          className="h-12 text-base-50 sm:flex-1 border-border/50 hover:border-primary/30 hover:ring-primary/10 focus:border-primary/50 focus:ring-primary/20"
          onChange={(even) => setNewTaskTitle(even.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="gradient"
          size="xl"
          className="px-6"
          onClick={addTask}
          disabled={!newTaskTitle.trim()}
        >
          <Plus className="size-5" />
          Thêm việc
        </Button>
      </div>
    </Card>
  );
};

export default AddTask;
