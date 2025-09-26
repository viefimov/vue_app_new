<script setup lang="ts">
import type { Task } from "../stores/tasks";
import type { User } from "../stores/user";

const props = defineProps<{
  task: Task;
  users: User[];
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();
</script>

<template>
  <a-modal
    :open="open"
    title="Подробности задачи"
    :footer="null"
    @cancel="emit('update:open', false)"
  >
    <p><strong>Название:</strong> {{ props.task.name }}</p>
    <p><strong>Описание:</strong> {{ props.task.description }}</p>
    <p><strong>Дедлайн:</strong> {{ props.task.deadline || "—" }}</p>
    <p>
      <strong>Исполнители:</strong>
      {{
        props.task.workers
          .map((id) => props.users.find((u) => u.id === id)?.name || id)
          .join(", ")
      }}
    </p>
  </a-modal>
</template>
