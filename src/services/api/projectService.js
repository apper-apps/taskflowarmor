import teamsData from "@/services/mockData/teams.json";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TeamService {
  constructor() {
    this.teams = [...teamsData];
  }

  async getAll() {
    await delay(250);
    return [...this.teams];
  }

  async getById(id) {
    await delay(200);
    const team = this.teams.find(t => t.Id === id);
    if (!team) {
      throw new Error("Team not found");
    }
    return { ...team };
  }

  async create(teamData) {
    await delay(400);
    const newId = Math.max(...this.teams.map(t => t.Id), 0) + 1;
    const newTeam = {
      Id: newId,
      ...teamData,
      taskCount: 0,
      createdAt: new Date().toISOString()
    };
    this.teams.push(newTeam);
    return { ...newTeam };
  }

  async update(id, teamData) {
    await delay(350);
    const index = this.teams.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Team not found");
    }
    
    const updatedTeam = {
      ...this.teams[index],
      ...teamData
    };
    
    this.teams[index] = updatedTeam;
    return { ...updatedTeam };
  }

  async delete(id) {
    await delay(250);
    const index = this.teams.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Team not found");
    }
    this.teams.splice(index, 1);
    return true;
  }
}

export const teamService = new TeamService();