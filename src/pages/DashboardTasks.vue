<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useDashboardStore, type Dashboard } from "../stores/dashboards";
import { useTaskStore, type Task } from "../stores/tasks";
import TaskCard from "../components/TaskCard.vue";
import { useUserStore } from "../stores/user";
import { useAuthStore } from "../stores/auth";
import TaskCreateModal from "../components/TaskCreateModal.vue";
const auth = useAuthStore()
const usersStore = useUserStore();
const route = useRoute();
const dashboardId = route.params.id as string;

const dashboardsStore = useDashboardStore();
const tasksStore = useTaskStore();
const userRole = computed(() => {
  if (!dashboard.value || !auth.user) return null;
  const member = dashboard.value.members.find(m => m.userId === auth.user?.id);
  return member?.role || null;
});
const isOwner = computed(() => userRole.value === 'owner');
onMounted(async () => {
  await dashboardsStore.fetchDashboards();
  await tasksStore.fetchTasks();
});

const dashboard = computed<Dashboard | undefined>(() =>
  dashboardsStore.dashboards.find((d) => d.id === dashboardId)
);
const users = computed(() => {
  if (!dashboard.value) return [];
  return usersStore.users.filter(u =>
    dashboard.value!.members.some(m => m.userId === u.id)
  );
});
const tasks = computed<Task[]>(() => {
  if (!dashboard.value) return [];
  return tasksStore.tasks.filter((t) => dashboard.value?.tasks.includes(t.id));
});
</script>

<template>
  <div class="dashboard-detail-page" v-if="dashboard">
    <div style="display:flex; justify-content: space-between;">
    <div><h2>{{ dashboard.name }}</h2>
    <p>Участники: {{ dashboard.members.length }}</p></div>
    <TaskCreateModal v-if="isOwner" :dashboardId="dashboard.id" :users="users"/>
    </div>
    <div class="tasks-list">
      <TaskCard
        v-for="t in tasks"
        :key="t.id"
        :task="t"
        :users="users"
        :isOwner="isOwner"
      />
    </div>
  </div>
  <div v-else>
    <p>Дашборд не найден</p>
  </div>
</template>

<style scoped>
.dashboard-detail-page {
  padding: 16px;
}
.tasks-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
}
</style>
