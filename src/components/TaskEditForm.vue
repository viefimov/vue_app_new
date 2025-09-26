<script setup lang="ts">
import { ref } from "vue";
import { type Task } from "../stores/tasks";
import { type User } from "../stores/user";
import dayjs from "dayjs";

const props = defineProps<{
  task: Task; 
  users: User[]; 
}>();

const emit = defineEmits<{
  (e: "save", task: Task): void;
  (e: "cancel"): void;
}>();

const localTask = ref<Task>({ ...props.task });
const selectedWorkers = ref<string[]>([...props.task.workers]);

function onSave() {
  emit("save", {
    ...localTask.value,
    workers: [...selectedWorkers.value],
  });
}
</script>

<template>
  <a-form layout="vertical" class="edit-form">
    <a-form-item label="Название задачи">
      <a-input v-model:value="localTask.name" />
    </a-form-item>

    <a-form-item label="Описание">
      <a-input v-model:value="localTask.description" />
    </a-form-item>

    <a-form-item label="Дедлайн">
      <a-date-picker
        :value="localTask.deadline ? dayjs(localTask.deadline) : null"
        @update:value="
          (val: any) =>
            (localTask.deadline = val ? val.format('YYYY-MM-DD') : '')
        "
      />
    </a-form-item>

    <a-form-item label="Исполнители">
      <a-select
        v-model:value="selectedWorkers"
        mode="multiple"
        style="width: 100%"
        placeholder="Выберите исполнителей"
      >
        <a-select-option v-for="u in props.users" :key="u.id" :value="u.id">
          {{ u.name }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <div class="form-actions">
      <a-button type="primary" @click="onSave">Сохранить</a-button>
      <a-button @click="$emit('cancel')">Отмена</a-button>
    </div>
  </a-form>
</template>

<style scoped>
.edit-form {
  padding: 12px;
}
.form-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
</style>
