import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProjectModal from "@/components/organisms/ProjectModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";

const ProjectsView = ({ searchQuery }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load projects");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = () => {
    setSelectedProject(null);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (projectData) => {
    try {
      if (selectedProject) {
        const updatedProject = await projectService.update(selectedProject.Id, projectData);
        setProjects(prev => prev.map(p => p.Id === selectedProject.Id ? updatedProject : p));
        toast.success("Project updated successfully!");
      } else {
        const newProject = await projectService.create(projectData);
        setProjects(prev => [...prev, newProject]);
        toast.success("Project created successfully!");
      }
    } catch (err) {
      toast.error("Failed to save project");
      console.error("Error saving project:", err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    if (projectTasks.length > 0) {
      toast.error("Cannot delete project with existing tasks");
      return;
    }

    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectService.delete(projectId);
        setProjects(prev => prev.filter(p => p.Id !== projectId));
        toast.success("Project deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete project");
        console.error("Error deleting project:", err);
      }
    }
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

  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const completedTasks = projectTasks.filter(task => task.status === "done");
    const inProgressTasks = projectTasks.filter(task => task.status === "in-progress");
    
    return {
      total: projectTasks.length,
      completed: completedTasks.length,
      inProgress: inProgressTasks.length,
      completionRate: projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0
    };
  };

  const filteredProjects = projects.filter(project => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return project.name.toLowerCase().includes(query);
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (filteredProjects.length === 0 && !searchQuery) {
    return (
      <Empty
        title="No projects yet"
        description="Create your first project to organize your tasks and track progress."
        actionLabel="Create Project"
        onAction={handleCreateProject}
        icon="Folder"
      />
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Organize and track your projects with detailed progress insights
          </p>
        </div>
        
        <Button onClick={handleCreateProject}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {searchQuery && filteredProjects.length === 0 ? (
        <Empty
          title="No projects found"
          description={`No projects match your search for "${searchQuery}". Try a different search term.`}
          actionLabel="Clear Search"
          onAction={() => {}}
          icon="Search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const stats = getProjectStats(project.Id);
            return (
              <div
                key={project.Id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getProjectColorClass(project.color)}`} />
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {project.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.Id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.completionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProjectColorClass(project.color)}`}
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {stats.total}
                    </div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">
                      {stats.inProgress}
                    </div>
                    <div className="text-xs text-gray-500">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {stats.completed}
                    </div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created</span>
                    <span>{format(new Date(project.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        project={selectedProject}
        onSave={handleSaveProject}
      />
    </div>
  );
};

export default ProjectsView;