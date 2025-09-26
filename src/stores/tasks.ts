import axios from "axios";
import { defineStore } from "pinia";

export interface Task {
  id: string;
  name: string;
  description: string;
  deadline: string;
  workers: string[];
  dashboardId: string;
}

export const useTaskStore = defineStore("tasks", {
  state: () => ({
    tasks: [] as Task[],
  }),
  actions: {
    async fetchTasks() {
      try {
        const { data } = await axios.get<Task[]>("http://localhost:3000/tasks");
        this.tasks = data;
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    },
    async fetchTasksByIds(ids: string[]) {
      await this.fetchTasks(); 
      return this.tasks.filter((t) => ids.includes(t.id));
    },

    async createTask(task: Task): Promise<Task | undefined> {
      try {
        const { data } = await axios.post<Task>(
          "http://localhost:3000/tasks",
          task
        );
        this.tasks.push(data);
        return data; 
      } catch (err) {
        console.error("Failed to create task:", err);
      }
    },

    async updateTask(task: Task) {
      try {
        const { data } = await axios.put<Task>(
          `http://localhost:3000/tasks/${task.id}`,
          task
        );
        const idx = this.tasks.findIndex((t) => t.id === task.id);
        if (idx !== -1) this.tasks[idx] = data;
      } catch (err) {
        console.error("Failed to update task:", err);
      }
    },

    async deleteTask(id: string) {
      try {
        await axios.delete(`http://localhost:3000/tasks/${id}`);
        this.tasks = this.tasks.filter((t) => t.id !== id);
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    },
  },
});
