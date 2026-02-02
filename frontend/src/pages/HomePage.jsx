// 1:51'

import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatsAndFilter from "@/components/StatsAndFilter";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

function HomePage() {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      // const res = await axios.get("http://localhost:5001/api/tasks");
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completeCount);
    } catch (error) {
      console.error("lỗi xãy ra khi truy xuất tasks:", error);
      toast.error("lỗi xãy ra khi truy xuất tasks");
    }
  };

  const handleTaskChanged = () => {
    fetchTasks();
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((pre) => pre + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((pre) => pre - 1);
    }
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  //biến lưu nhiệm vụ danh sách đã filter
  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "complete";
      default:
        return true;
    }
  });

  // Cách làm bth không dùng axios để fetch api

  // const fetchTasks = async () => {
  //   try {
  //     const res = await fetch("http://localhost:5001/api/tasks");
  //     const data = await res.json();
  //     setTaskBuffer(data);
  //     console.log(data);
  //   } catch (error) {
  //     console.error("loi xay ra khi truy xuat tasks:", error);
  //     toast.error("loi xay ra khi truy xuat task");
  //   }
  // };

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit,
  );

  if (visibleTasks.length === 0) {
    handlePrev();
  }

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
      {/* Phối màu từ trang https://patterncraft.fun/ - Loại: Dreamy Sky Pink Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
        }}
      />
      <div className="container pt-8 mx-auto relative z-10">
        <h1 className="w-full max-w-2xl p-6 mx-auto space-y-6">
          <Header />

          <AddTask handleNewTaskAdded={handleTaskChanged} />

          <StatsAndFilter
            filter={filter}
            setFilter={setFilter}
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />

          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            handleTaskChanged={handleTaskChanged}
          />

          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>
          <Footer
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />
        </h1>
      </div>
    </div>
  );
}
export default HomePage;
