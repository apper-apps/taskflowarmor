import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import TeamModal from "@/components/organisms/TeamModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { teamService } from "@/services/api/teamService";
import { taskService } from "@/services/api/taskService";

const TeamsView = ({ searchQuery }) => {
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [teamsData, tasksData] = await Promise.all([
        teamService.getAll(),
        taskService.getAll()
      ]);
      setTeams(teamsData);
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load teams");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTeam = () => {
    setSelectedTeam(null);
    setIsTeamModalOpen(true);
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setIsTeamModalOpen(true);
  };

  const handleSaveTeam = async (teamData) => {
    try {
      if (selectedTeam) {
        const updatedTeam = await teamService.update(selectedTeam.Id, teamData);
        setTeams(prev => prev.map(t => t.Id === selectedTeam.Id ? updatedTeam : t));
        toast.success("Team updated successfully!");
      } else {
        const newTeam = await teamService.create(teamData);
        setTeams(prev => [...prev, newTeam]);
        toast.success("Team created successfully!");
      }
    } catch (err) {
      toast.error("Failed to save team");
      console.error("Error saving team:", err);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    const teamTasks = tasks.filter(task => task.projectId === teamId);
    if (teamTasks.length > 0) {
      toast.error("Cannot delete team with existing tasks");
      return;
    }

    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await teamService.delete(teamId);
        setTeams(prev => prev.filter(t => t.Id !== teamId));
        toast.success("Team deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete team");
        console.error("Error deleting team:", err);
      }
    }
  };

  const getTeamColorClass = (color) => {
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

  const getTeamStats = (teamId) => {
    const teamTasks = tasks.filter(task => task.projectId === teamId);
    const completedTasks = teamTasks.filter(task => task.status === "done");
    const inProgressTasks = teamTasks.filter(task => task.status === "in-progress");
    
    return {
      total: teamTasks.length,
      completed: completedTasks.length,
      inProgress: inProgressTasks.length,
      completionRate: teamTasks.length > 0 ? Math.round((completedTasks.length / teamTasks.length) * 100) : 0
    };
  };

  const filteredTeams = teams.filter(team => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return team.name.toLowerCase().includes(query);
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (filteredTeams.length === 0 && !searchQuery) {
    return (
      <Empty
        title="No teams yet"
        description="Create your first team to organize your tasks and track progress."
        actionLabel="Create Team"
        onAction={handleCreateTeam}
        icon="Users"
      />
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-1">
            Organize and track your teams with detailed progress insights
          </p>
        </div>
        
        <Button onClick={handleCreateTeam}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Team
        </Button>
      </div>

      {searchQuery && filteredTeams.length === 0 ? (
        <Empty
          title="No teams found"
          description={`No teams match your search for "${searchQuery}". Try a different search term.`}
          actionLabel="Clear Search"
          onAction={() => {}}
          icon="Search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const stats = getTeamStats(team.Id);
            return (
              <div
                key={team.Id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getTeamColorClass(team.color)}`} />
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {team.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditTeam(team)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.Id)}
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
                      className={`h-2 rounded-full transition-all duration-300 ${getTeamColorClass(team.color)}`}
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
                    <span>{format(new Date(team.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        team={selectedTeam}
        onSave={handleSaveTeam}
      />
    </div>
  );
};

export default TeamsView;