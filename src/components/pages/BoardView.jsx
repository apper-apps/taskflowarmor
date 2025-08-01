import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import KanbanColumn from "@/components/organisms/KanbanColumn";
import TaskModal from "@/components/organisms/TaskModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { projectService } from "@/services/api/projectService";

const BoardView = ({ searchQuery }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      setError("Failed to load tasks and projects");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        const updatedTask = await taskService.update(selectedTask.Id, taskData);
        setTasks(prev => prev.map(t => t.Id === selectedTask.Id ? updatedTask : t));
        toast.success("Task updated successfully!");
      } else {
        const newTask = await taskService.create(taskData);
        setTasks(prev => [...prev, newTask]);
        toast.success("Task created successfully!");
      }
    } catch (err) {
      toast.error("Failed to save task");
      console.error("Error saving task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(taskId);
        setTasks(prev => prev.filter(t => t.Id !== taskId));
        toast.success("Task deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete task");
        console.error("Error deleting task:", err);
      }
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      const updatedTask = await taskService.update(taskId, { status: newStatus });
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
      toast.success(`Task moved to ${newStatus.replace("-", " ")}`);
    } catch (err) {
      toast.error("Failed to move task");
      console.error("Error moving task:", err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      (projects.find(p => p.Id === task.projectId)?.name.toLowerCase() || "").includes(query)
    );
  });

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const totalTasks = filteredTasks.length;
  if (totalTasks === 0 && !searchQuery) {
    return (
      <Empty
        title="No tasks yet"
        description="Create your first task to start organizing your work with the Kanban board."
        actionLabel="Create Task"
        onAction={handleCreateTask}
        icon="LayoutGrid"
      />
    );
  }

  const columns = [
    {
      title: "To Do",
      status: "todo",
      icon: "Circle",
      color: "text-blue-500",
      tasks: getTasksByStatus("todo")
    },
    {
      title: "In Progress",
      status: "in-progress",
      icon: "Clock",
      color: "text-yellow-500",
      tasks: getTasksByStatus("in-progress")
    },
    {
      title: "Done",
      status: "done",
      icon: "CheckCircle",
      color: "text-green-500",
      tasks: getTasksByStatus("done")
    }
  ];

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Board View</h1>
          <p className="text-gray-600 mt-1">
            Organize and track your tasks with drag-and-drop kanban boards
          </p>
        </div>
        
        <Button onClick={handleCreateTask}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {searchQuery && totalTasks === 0 ? (
        <Empty
          title="No tasks found"
          description={`No tasks match your search for "${searchQuery}". Try a different search term.`}
          actionLabel="Clear Search"
          onAction={() => {}}
          icon="Search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.status}
              title={column.title}
              status={column.status}
              tasks={column.tasks}
              projects={projects}
              onTaskEdit={handleEditTask}
              onTaskDelete={handleDeleteTask}
              onTaskMove={handleMoveTask}
              icon={column.icon}
              color={column.color}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        projects={projects}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default BoardView;