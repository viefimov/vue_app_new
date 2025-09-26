import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import DashboardsListPage from "../pages/DashboardsListPage.vue";
import DashboardTasks from "../pages/DashboardTasks.vue";
import NotFound from "../pages/NotFound.vue";
const routes = [
  { path: "/", name: "list", component: DashboardsListPage },
  { path: "/login", name: "login", component: LoginPage },
  { path: "/register", name: "register", component: RegisterPage },
  {
    path: "/dashboard/:id",
    name: "DashboardTasks",
    component: DashboardTasks,
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
