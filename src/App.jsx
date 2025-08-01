import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import TeamsView from "@/components/pages/TeamsView";
import TeamModal from "@/components/organisms/TeamModal";
import { teamService } from "@/services/api/teamService";
import "@/index.css";
import { taskService } from "@/services/api/taskService";
import TaskModal from "@/components/organisms/TaskModal";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import BoardView from "@/components/pages/BoardView";
import ListView from "@/components/pages/ListView";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
React.useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamsData = await teamService.getAll();
        setTeams(teamsData);
      } catch (err) {
        console.error("Error loading teams:", err);
      }
    };
    loadTeams();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateTask = () => {
    setIsTaskModalOpen(true);
  };

const handleCreateTeam = () => {
    setIsTeamModalOpen(true);
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

const handleSaveTeam = async (teamData) => {
    try {
      const newTeam = await teamService.create(teamData);
      setTeams(prev => [...prev, newTeam]);
      toast.success("Team created successfully!");
    } catch (err) {
      toast.error("Failed to create team");
      console.error("Error creating team:", err);
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
                path="/teams" 
                element={<TeamsView searchQuery={searchQuery} />} 
              />
            </Routes>
          </main>
        </div>

        <Sidebar 
teams={teams}
          onCreateTask={handleCreateTask}
          onCreateTeam={handleCreateTeam}
        />

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          task={null}
          projects={projects}
          onSave={handleSaveTask}
        />

<TeamModal
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
          team={null}
          onSave={handleSaveTeam}
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