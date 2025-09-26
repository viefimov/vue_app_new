<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import dayjs from "dayjs";
import { useTaskStore } from "../stores/tasks";
import { useUserStore, type User } from "../stores/user";
import { useDashboardStore } from "../stores/dashboards";

const props = defineProps<{ dashboardId: string, users : User[] }>();
onMounted(async () => {
  await usersStore.getUsers(); 
});
const tasksStore = useTaskStore();
const usersStore = useUserStore();
const dashboardsStore = useDashboardStore();


const isModalVisible = ref(false);
const taskName = ref("");
const taskDescription = ref("");
const selectedWorkers = ref<string[]>([]);
const taskDeadline = ref<string>("");

const errorName = ref(false);

function openModal() {
  isModalVisible.value = true;
  errorName.value = false;
}

function handleCancel() {
  isModalVisible.value = false;
}

watch(taskName, (val) => {
  if (val.trim() !== "") errorName.value = false;
});


async function handleOk() {
  if (!taskName.value.trim()) {
    errorName.value = true;
    return;
  }

  try {
    const newTask = {
      id: Date.now().toString(),
      name: taskName.value,
      description: taskDescription.value,
      deadline: taskDeadline.value,
      workers: selectedWorkers.value,
      dashboardId: props.dashboardId,
    };

    await tasksStore.createTask(newTask);

    const dashboard = dashboardsStore.dashboards.find(
      (d) => d.id === props.dashboardId
    );
    if (dashboard) {
      dashboard.tasks.push(newTask.id);
      await dashboardsStore.updateDashboard(dashboard);
    }

    for (const id of selectedWorkers.value) {
      await usersStore.addTaskToUser(id, newTask.id);
    }

    taskName.value = "";
    taskDescription.value = "";
    selectedWorkers.value = [];
    taskDeadline.value = "";
    isModalVisible.value = false;
  } catch (err) {
    console.error(err);
  }
}
</script>

<template>
  <div>
    <a-button type="primary" @click="openModal">Создать задачу</a-button>

    <a-modal title="Новая задача" v-model:open="isModalVisible" :footer="null">
      <a-input
        v-model:value="taskName"
        placeholder="Название задачи"
        @input="errorName = false"
      />
      <p v-if="errorName" style="color: red">Введите название задачи</p>

      <a-input
        v-model:value="taskDescription"
        placeholder="Описание задачи"
        style="margin-top: 12px"
      />

      <a-date-picker
        :value="taskDeadline ? dayjs(taskDeadline) : null"
        style="margin-top: 12px; width: 100%"
        format="YYYY-MM-DD"
        placeholder="Дедлайн"
        @update:value="
          (val:any) => (taskDeadline = val ? val.format('YYYY-MM-DD') : '')
        "
      />

      <a-select
        v-model:value="selectedWorkers"
        mode="multiple"
        placeholder="Выберите исполнителей"
        style="margin-top: 12px; width: 100%"
      >
        <a-select-option
          v-for="u in users"
          :key="u.id"
          :value="u.id"
        >
          {{ u.name }}
        </a-select-option>
      </a-select>

      <div style="margin-top: 16px; text-align: right">
        <a-button @click="handleCancel" style="margin-right: 8px"
          >Отмена</a-button
        >
        <a-button type="primary" @click="handleOk">OK</a-button>
      </div>
    </a-modal>
  </div>
</template>
