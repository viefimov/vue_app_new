<script setup lang="ts">
import { computed, defineProps } from "vue";
import { useRouter } from "vue-router";
import { useDashboardStore, type Dashboard } from "../stores/dashboards";
import { useAuthStore } from "../stores/auth";

const props = defineProps<{
  dashboard: Dashboard;
}>();

const router = useRouter();
const dashboardsStore = useDashboardStore();
const auth = useAuthStore();


const isMember = computed(() =>
  props.dashboard.members.some((m) => m.userId === auth.user?.id)
);


function goToDashboard() {
  router.push(`/dashboard/${props.dashboard.id}`);
}

async function joinDashboard() {
  if (!auth.user) return;
  props.dashboard.members.push({ userId: auth.user.id, role: "worker" });
  await dashboardsStore.updateDashboard(props.dashboard);
}
</script>

<template>
  <a-card hoverable class="dashboard-card">
    <div class="header">
      <h3>{{ dashboard.name }}</h3>
      <div v-if="isMember">
        <a-button type="primary" size="small" @click="goToDashboard">
          К задачам
        </a-button>
      </div>
      <div v-else v-if="auth.isAuthenticated">
        <a-button type="default" size="small" @click="joinDashboard">
          Присоединиться
        </a-button>
      </div>
    </div>
    <p class="info">
      Задачи: {{ dashboard.tasks.length }} | Участники:
      {{ dashboard.members.length }}
    </p>
  </a-card>
</template>

<style scoped>
.dashboard-card {
  width: 100%;
  max-width: 320px;
  margin: 8px;
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info {
  margin-top: 8px;
  color: #555;
  font-size: 14px;
}
</style>
