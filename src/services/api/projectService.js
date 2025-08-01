import projectsData from '@/services/mockData/projects.json';

// Simulate API delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
  }

  // Get all projects
  async getAll() {
    await delay(300);
    return this.projects;
  }

  // Get project by ID
  async getById(id) {
    await delay(200);
    const project = this.projects.find(project => project.id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  // Get projects by team ID
  async getByTeamId(teamId) {
    await delay(200);
    return this.projects.filter(project => project.teamId === teamId);
  }

  // Create new project
  async create(projectData) {
    await delay(400);
    const newProject = {
      id: Math.max(...this.projects.map(p => p.id)) + 1,
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.projects.push(newProject);
    return newProject;
  }

  // Update project
  async update(id, projectData) {
    await delay(300);
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    this.projects[index] = {
      ...this.projects[index],
      ...projectData,
      updatedAt: new Date().toISOString()
    };
    return this.projects[index];
  }

  // Delete project
  async delete(id) {
    await delay(300);
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    this.projects.splice(index, 1);
    return true;
  }
}

export const projectService = new ProjectService();