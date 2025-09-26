<script setup lang="ts">
import { onMounted, computed } from "vue";
import DashboardCard from "../components/DashboardCard.vue";
import DashboardCreateModal from "../components/DashboardCreateModal.vue";
import { useDashboardStore } from "../stores/dashboards";
import { useAuthStore } from "../stores/auth";


const dashboardsStore = useDashboardStore();
const auth = useAuthStore();

onMounted(() => {
  dashboardsStore.fetchDashboards();
});


const userDashboards = computed(() => {
  if (!auth.user) return dashboardsStore.dashboards;

  return [...dashboardsStore.dashboards].sort((a, b) => {
    const aHasUser = a.members.some(m => m.userId === auth.user?.id);
    const bHasUser = b.members.some(m => m.userId === auth.user?.id);

    if (aHasUser && !bHasUser) return -1;
    if (!aHasUser && bHasUser) return 1;
    return 0; 
})});

</script>

<template>
  <div class="dashboards-page">
    <div class="dashboards-header">
      <h2>Список дашбордов</h2>
      <DashboardCreateModal v-if="auth.isAuthenticated"/>
    </div>

    <div class="dashboards-list">
      <DashboardCard
        v-for="d in userDashboards"
        :key="d.id"
        :dashboard="d"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboards-page {
  padding: 16px;
}

.dashboards-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.dashboards-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
