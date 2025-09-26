import axios from "axios";
import { defineStore } from "pinia";
import { useUserStore, type User } from "./user.ts";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || "null") as {
      id: string;
      name: string;
    } | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async login(username: string, password: string) {
      const users = await axios
        .get<User[]>("http://localhost:3000/users")
        .then((res) => res.data);
      const found = users.find((u) => u.name === username);

      if (found && found.password === password) {
        this.user = { id: found.id, name: found.name };
        localStorage.setItem("user", JSON.stringify(this.user));
        return true; 
      }

      return false; 
    },
    async register(name: string, email: string, password: string) {
      const userStore = useUserStore();
      const { data: existingUsers } = await axios.get<User[]>(
        `http://localhost:3000/users?email=${email}`
      );
      if (existingUsers.length > 0) {
        throw new Error("Пользователь с таким email уже существует");
      }
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        tasks: [],
      };
      const { data } = await axios.post<User>(
        "http://localhost:3000/users",
        newUser
      );
      userStore.users.push(data);
      this.user = data;

      return data;
    },
    logout() {
      this.user = null;
      localStorage.removeItem("user");
    },
  },
});
