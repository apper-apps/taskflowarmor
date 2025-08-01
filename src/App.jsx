import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import BoardView from "@/components/pages/BoardView";
import ListView from "@/components/pages/ListView";
import ProjectsView from "@/components/pages/ProjectsView";
import TaskModal from "@/components/organisms/TaskModal";
import ProjectModal from "@/components/organisms/ProjectModal";
import { taskService } from "@/services/api/taskService";
import { projectService } from "@/services/api/projectService";
import { toast } from "react-toastify";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  React.useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await projectService.getAll();
        setProjects(projectsData);
      } catch (err) {
        console.error("Error loading projects:", err);
      }
    };
    loadProjects();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateTask = () => {
    setIsTaskModalOpen(true);
  };

  const handleCreateProject = () => {
    setIsProjectModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      await taskService.create(taskData);
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error("Failed to create task");
      console.error("Error creating task:", err);
    }
  };

  const handleSaveProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, newProject]);
      toast.success("Project created successfully!");
    } catch (err) {
      toast.error("Failed to create project");
      console.error("Error creating project:", err);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <div className="lg:pl-64">
          <Header 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
          
          <main className="flex-1">
            <Routes>
              <Route 
                path="/" 
                element={<BoardView searchQuery={searchQuery} />} 
              />
              <Route 
                path="/list" 
                element={<ListView searchQuery={searchQuery} />} 
              />
              <Route 
                path="/projects" 
                element={<ProjectsView searchQuery={searchQuery} />} 
              />
            </Routes>
          </main>
        </div>

        <Sidebar 
          projects={projects}
          onCreateTask={handleCreateTask}
          onCreateProject={handleCreateProject}
        />

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          task={null}
          projects={projects}
          onSave={handleSaveTask}
        />

        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          project={null}
          onSave={handleSaveProject}
        />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;