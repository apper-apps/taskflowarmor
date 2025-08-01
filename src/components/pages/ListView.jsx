import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import TaskModal from "@/components/organisms/TaskModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { projectService } from "@/services/api/projectService";

const ListView = ({ searchQuery }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

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

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getProject = (projectId) => {
    return projects.find(p => p.Id === projectId);
  };

  const getProjectColorClass = (color) => {
    const colorMap = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
      indigo: "bg-indigo-500",
      teal: "bg-teal-500"
    };
    return colorMap[color] || "bg-gray-500";
  };

  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      (getProject(task.projectId)?.name.toLowerCase() || "").includes(query)
    );
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "project") {
      aValue = getProject(a.projectId)?.name || "";
      bValue = getProject(b.projectId)?.name || "";
    }

    if (sortField === "dueDate" || sortField === "createdAt") {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (filteredTasks.length === 0 && !searchQuery) {
    return (
      <Empty
        title="No tasks yet"
        description="Create your first task to start organizing your work in list view."
        actionLabel="Create Task"
        onAction={handleCreateTask}
        icon="List"
      />
    );
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ApperIcon name="ArrowUpDown" className="w-4 h-4 text-gray-400" />;
    return (
      <ApperIcon 
        name={sortDirection === "asc" ? "ArrowUp" : "ArrowDown"} 
        className="w-4 h-4 text-primary-500" 
      />
    );
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">List View</h1>
          <p className="text-gray-600 mt-1">
            View and manage all your tasks in a sortable table format
          </p>
        </div>
        
        <Button onClick={handleCreateTask}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {searchQuery && filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          description={`No tasks match your search for "${searchQuery}". Try a different search term.`}
          actionLabel="Clear Search"
          onAction={() => {}}
          icon="Search"
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("title")}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      <span>Task</span>
                      <SortIcon field="title" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      <span>Status</span>
                      <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("priority")}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      <span>Priority</span>
                      <SortIcon field="priority" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("project")}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      <span>Project</span>
                      <SortIcon field="project" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("dueDate")}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      <span>Due Date</span>
                      <SortIcon field="dueDate" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTasks.map((task) => {
                  const project = getProject(task.projectId);
                  return (
                    <tr key={task.Id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={task.status}>
                          {task.status.replace("-", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {task.priority && (
                          <Badge variant={task.priority}>
                            {task.priority}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {project && (
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getProjectColorClass(project.color)}`} />
                            <span className="text-sm text-gray-900">{project.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {task.dueDate && (
                          <span className="text-sm text-gray-500">
                            {format(new Date(task.dueDate), "MMM d, yyyy")}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <ApperIcon name="Edit2" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.Id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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

export default ListView;