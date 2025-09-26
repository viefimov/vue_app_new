import { defineStore } from "pinia";
import axios from "axios";

export interface DashboardMember {
  userId: string;
  role: "owner" | "worker";
}

export interface Dashboard {
  id: string;
  name: string;
  tasks: string[];
  members: DashboardMember[];
}

export const useDashboardStore = defineStore("dashboards", {
  state: () => ({
    dashboards: [] as Dashboard[],
  }),

  actions: {
    async fetchDashboards() {
      try {
        await axios
          .get<Dashboard[]>("http://localhost:3000/dashboards")
          .then((res) => (this.dashboards = res.data));
      } catch (error) {
        console.error("Failed to fetch dashboards:", error);
      }
    },

    async createDashboard(name: string, ownerId: string) {
      const newDashboard: Dashboard = {
        id: Date.now().toString(), 
        name,
        tasks: [],
        members: [{ userId: ownerId, role: "owner" }],
      };

      try {
        await axios
          .post<Dashboard>("http://localhost:3000/dashboards", newDashboard)
          .then((res) => {
            this.dashboards = [...this.dashboards, res.data];
          });
      } catch (error) {
        console.error("Failed to create dashboard:", error);
      }
    },
    async updateDashboard(dashboard: Dashboard) {
      try {
        const { data } = await axios.put<Dashboard>(
          `http://localhost:3000/dashboards/${dashboard.id}`,
          dashboard
        );
        const idx = this.dashboards.findIndex((d) => d.id === dashboard.id);
        if (idx !== -1) this.dashboards[idx] = data;
      } catch (error) {
        console.error("Failed to update dashboard:", error);
      }
    },
    async deleteDashboard(dashboardId: string) {
      try {
        await axios.delete(`http://localhost:3000/dashboards/${dashboardId}`);
        this.dashboards = this.dashboards.filter((d) => d.id !== dashboardId);
      } catch (error) {
        console.error("Failed to delete dashboard:", error);
      }
    },
    getDashboardsByUser(userId: string) {
      return this.dashboards.filter((d) =>
        d.members.some((m) => m.userId === userId)
      );
    },
    getUserRole(dashboardId: string, userId: string) {
      const dashboard = this.dashboards.find((d) => d.id === dashboardId);
      const member = dashboard?.members.find((m) => m.userId === userId);
      return member?.role || null;
    },
  },
});
