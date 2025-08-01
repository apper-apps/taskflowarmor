import projectsData from "@/services/mockData/projects.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
  }

  async getAll() {
    await delay(250);
    return [...this.projects];
  }

  async getById(id) {
    await delay(200);
    const project = this.projects.find(p => p.Id === id);
    if (!project) {
      throw new Error("Project not found");
    }
    return { ...project };
  }

  async create(projectData) {
    await delay(400);
    const newId = Math.max(...this.projects.map(p => p.Id), 0) + 1;
    const newProject = {
      Id: newId,
      ...projectData,
      taskCount: 0,
      createdAt: new Date().toISOString()
    };
    this.projects.push(newProject);
    return { ...newProject };
  }

  async update(id, projectData) {
    await delay(350);
    const index = this.projects.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    
    const updatedProject = {
      ...this.projects[index],
      ...projectData
    };
    
    this.projects[index] = updatedProject;
    return { ...updatedProject };
  }

  async delete(id) {
    await delay(250);
    const index = this.projects.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    this.projects.splice(index, 1);
    return true;
  }
}

export const projectService = new ProjectService();