<script setup lang="ts">
import { ref } from "vue";
import { useDashboardStore } from "../stores/dashboards";
import { useAuthStore } from "../stores/auth";

const dashboardsStore = useDashboardStore();
const auth = useAuthStore();

const isModalVisible = ref(false);
const dashboardName = ref("");
const errorName = ref(!dashboardName);
function openModal() {
  isModalVisible.value = true;
  errorName.value = false;
}

async function handleOk() {
  if (!dashboardName.value || !auth.user) {
    errorName.value = true;
    return;
  }

  try {
    await dashboardsStore.createDashboard(dashboardName.value, auth.user.id);
    dashboardName.value = "";
    isModalVisible.value = false;
    errorName.value = false;
  } catch (err) {
    console.error(err);
  }
}

function handleCancel() {
  isModalVisible.value = false;
}
</script>

<template>
  <div>
    <a-button type="primary" @click="openModal">Создать дашборд</a-button>

    <a-modal title="Новый дашборд" v-model:open="isModalVisible" :footer="null">
      <a-input @input="errorName = false" v-model:value="dashboardName" placeholder="Название дашборда" />
      <p v-if="errorName" style="color: red">Введите название</p>
      <div style="margin-top: 16px; text-align: right">
        <a-button @click="handleCancel" style="margin-right: 8px"
          >Отмена</a-button
        >
        <a-button type="primary" @click="handleOk">OK</a-button>
      </div>
    </a-modal>
  </div>
</template>
