import { defineStore } from "pinia";
import axios from "axios";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  tasks: string[];
}

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [] as User[],
  }),
  actions: {
    async getUsers() {
      try {
        const { data } = await axios.get<User[]>("http://localhost:3000/users");
        this.users = data;
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    },
    async addUser(user: User) {
      try {
        const { data } = await axios.post<User>(
          "http://localhost:3000/users",
          user
        );
        this.users.push(data);
      } catch (error) {
        console.error("Failed to add user:", error);
      }
    },
    async updateUser(user: User) {
      try {
        const { data } = await axios.put<User>(
          `http://localhost:3000/users/${user.id}`,
          user
        );
        const idx = this.users.findIndex((u) => u.id === user.id);
        if (idx !== -1) this.users[idx] = data;
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    },
    async deleteUser(id: string) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        this.users = this.users.filter((u) => u.id !== id);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    },
    async addTaskToUser(userId: string, taskId: string) {
      try {
        const { data: current } = await axios.get<User>(
          `http://localhost:3000/users/${userId}`
        );
        if (!current.tasks.includes(taskId)) {
          const updated = { ...current, tasks: [...current.tasks, taskId] };
          await axios.put<User>(
            `http://localhost:3000/users/${userId}`,
            updated
          );
          const idx = this.users.findIndex((u) => u.id === userId);
          if (idx !== -1) this.users[idx] = updated;
        }
      } catch (err) {
        console.error("Failed to add task:", err);
      }
    },
    async removeTaskFromUser(userId: string, taskId: string) {
      const user = this.users.find((u) => u.id === userId);
      if (!user) return;
      user.tasks = user.tasks.filter((t) => t !== taskId);
      try {
        await axios.put(`http://localhost:3000/users/${userId}`, user);
      } catch (error) {
        console.error("Failed to update user on server:", error);
      }
    },
  },
});
