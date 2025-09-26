<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");

async function handleRegister() {
  errorMessage.value = "";
  if (!name.value || !email.value || !password.value) {
    errorMessage.value = "Заполните все поля";
    return;
  }
  try {
    await auth.register(name.value, email.value, password.value);
    alert("Регистрация успешна! Вы автоматически вошли в систему.");
    router.push("/");
  } catch (err: any) {
    errorMessage.value = err.message || "Ошибка регистрации";
  }
}
</script>

<template>
  <div class="register-form">
    <h2>Регистрация</h2>
    <div class="register-inputs">
      <a-input v-model:value="name" placeholder="Имя" />
      <a-input v-model:value="email" type="email" placeholder="Email" />
      <a-input v-model:value="password" type="password" placeholder="Пароль" />
      <a-p style="color: red" v-if="errorMessage">{{ errorMessage }}</a-p>
      <a-button  type="primary" @click="handleRegister"
        >Зарегистрироваться</a-button
      >
    </div>
  </div>
</template>

<style lang="less">
.register-form {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  gap: 12px;
}
.register-inputs {
  display: flex;
  width: 25%;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  .ant-btn {
    width:100%;
  }
}
</style>
