<script setup lang="ts">
import { ref, computed } from "vue";
import { useTaskStore, type Task } from "../stores/tasks";
import { useUserStore, type User } from "../stores/user";
import TaskEditForm from "./TaskEditForm.vue";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import { useDashboardStore } from "../stores/dashboards";
import TaskDetailsModal from "./TaskDetailsModal.vue";

const props = defineProps<{ task: Task; users: User[]; isOwner: boolean }>();

const canEdit = props.isOwner;
const dashboardsStore = useDashboardStore();
const tasksStore = useTaskStore();
const usersStore = useUserStore();
const editing = ref(false);
const isDetailModalVisible = ref(false);

function toggleEdit() {
  editing.value = !editing.value;
}
function handleCardClick() {
  if (!editing.value) {
    isDetailModalVisible.value = true;
  }
}
async function handleSave(updatedTask: Task) {
  const oldWorkers = [...props.task.workers];
  const newWorkers = [...updatedTask.workers];

  await tasksStore.updateTask(updatedTask);

  const added = newWorkers.filter((id) => !oldWorkers.includes(id));
  const removed = oldWorkers.filter((id) => !newWorkers.includes(id));

  for (const id of added) await usersStore.addTaskToUser(id, updatedTask.id);
  for (const id of removed)
    await usersStore.removeTaskFromUser(id, updatedTask.id);

  editing.value = false;
}

async function handleDelete() {
  await tasksStore.deleteTask(props.task.id);

  const promises = props.task.workers.map((userId) =>
    usersStore.removeTaskFromUser(userId, props.task.id)
  );
  await Promise.all(promises);

  const dashboard = dashboardsStore.dashboards.find((d) =>
    d.tasks.includes(props.task.id)
  );
  if (dashboard) {
    dashboard.tasks = dashboard.tasks.filter((tid) => tid !== props.task.id);
    await dashboardsStore.updateDashboard(dashboard);
  }
}

const workerNames = computed(() =>
  props.task.workers
    .map((id) => props.users.find((u) => u.id === id)?.name || id)
    .join(", ")
);
</script>

<template>
  <a-card hoverable class="task-card" @click="handleCardClick">
    <template #title>
      <TaskDetailsModal
        :open="isDetailModalVisible"
        @update:open="isDetailModalVisible = $event"
        :task="props.task"
        :users="props.users"
      />
      <div class="task-header">
        <span class="task-title">{{ props.task.name }}</span>
        <div class="task-actions" v-if="canEdit">
          <a-button type="link" size="small" @click.stop="toggleEdit">
            <EditOutlined />
          </a-button>
          <a-popconfirm
            title="Удалить задачу?"
            ok-text="Да"
            cancel-text="Нет"
            @confirm="handleDelete"
          >
            <a-button danger type="link" size="small" @click.stop>
              <DeleteOutlined />
            </a-button>
          </a-popconfirm>
        </div>
      </div>
    </template>

    <task-edit-form
      v-if="editing"
      :task="props.task"
      :users="usersStore.users"
      @save="handleSave"
      @cancel="toggleEdit"
    />

    <div v-else class="task-view">
      <div class="task-details">
        <p class="desc">{{ props.task.description }}</p>
        <p class="deadline">
          <strong>Дедлайн:</strong> {{ props.task.deadline || "—" }}
        </p>
      </div>

      <div class="task-workers">
        <strong>Исполнители:</strong> <br />
        <span class="names" :title="workerNames">{{ workerNames }}</span>
      </div>
    </div>
  </a-card>
</template>

<style scoped>
.task-card {
  width: 100%;
  box-sizing: border-box;
}

/* Заголовок */
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.task-title {
  font-weight: 600;
  font-size: 16px;
  word-break: break-word;
}
.task-actions {
  display: flex;
  gap: 8px;
}

.task-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

.task-details {
  min-width: 0;
}
.desc {
  margin-bottom: 8px;
}
.deadline {
  color: #555;
}

.task-workers {
  text-align: right;
  min-width: 0;
}
.names {
  display: inline-block;
  color: #333;
}

.desc,
.deadline,
.names {
  display: block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.task-actions {
  min-width: 0;
}

.task-actions .a-button {
  flex: 1 1 auto; /* разрешить сжатие */
  min-width: 0; /* нужно для работы text-overflow */
  font-size: 14px; /* базовый размер */
  white-space: wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px; /* ограничиваем ширину для длинных слов */
}

/* 🔹 адаптация для маленьких экранов */
@media (max-width: 480px) {
  .task-actions .a-button {
    font-size: 12px; /* уменьшаем шрифт */
    max-width: 90px; /* ещё чуть меньше */
  }
  .ant-card-head {
    padding-inline: 15px;
  }
}

@media (max-width: 360px) {
  .task-actions .a-button {
    font-size: 11px;
    max-width: 70px;
    width: fit-content;
  }
}
/* 🔹 Адаптивность */
@media (max-width: 768px) {
  .task-view {
    grid-template-columns: 1fr; /* одна колонка на узком экране */
    text-align: left;
  }
  .task-workers {
    text-align: left;
  }
}
</style>
