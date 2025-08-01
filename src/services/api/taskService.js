import tasksData from "@/services/mockData/tasks.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.Id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

  async create(taskData) {
    await delay(400);
    const newId = Math.max(...this.tasks.map(t => t.Id), 0) + 1;
    const newTask = {
      Id: newId,
      ...taskData,
      createdAt: new Date().toISOString(),
      completedAt: taskData.status === "done" ? new Date().toISOString() : null
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await delay(350);
    const index = this.tasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...taskData,
      completedAt: taskData.status === "done" ? new Date().toISOString() : null
    };
    
    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    this.tasks.splice(index, 1);
    return true;
  }

  async getByProject(projectId) {
    await delay(300);
    return this.tasks.filter(t => t.projectId === projectId).map(t => ({ ...t }));
  }

  async getByStatus(status) {
    await delay(300);
    return this.tasks.filter(t => t.status === status).map(t => ({ ...t }));
  }
}

export const taskService = new TaskService();