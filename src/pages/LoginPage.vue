<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();

const name = ref("");
const password = ref("");
const error = ref("");

async function handleLogin() {
  error.value = "";

  if (!name.value || !password.value) {
    error.value = "Введите имя и пароль";
    return;
  }

  const success = await auth.login(name.value, password.value);

  if (success) {
    router.push("/");
  } else {
    error.value = "Неверное имя или пароль";
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-box">
      <h2 style="text-align: center">Вход</h2>
      <a-input v-model:value="name" placeholder="Имя" />
      <a-input v-model:value="password" placeholder="Пароль" />
      <a-button type="primary" @click="handleLogin"> Войти </a-button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px;
}

.login-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 25%;
}

.error {
  color: #d93025;
}

/* 🔹 Адаптивность */
@media (max-width: 600px) {
  .login-page {
    flex-direction: column;
    align-items: center;
  }
}
</style>
