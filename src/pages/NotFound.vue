<script setup lang="ts">
// Никакой логики не требуется, только разметка
</script>

<template>
  <div class="not-found">
    <p>Страница не найдена :(</p>
    <RouterLink to="/">На главную</RouterLink>
  </div>
</template>

<style scoped lang="less">
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center; 
  font-size: 40px;
  margin-top: 40px;
}
</style>
