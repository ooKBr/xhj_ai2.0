<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      编辑
      <code>components/HelloWorld.vue</code> 来测试热更新
    </p>
  </div>

  <p>
    查看
    <a href="https://vuejs.org/guide/quick-start.html" target="_blank">Vue 官方文档</a>
    了解更多。
  </p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
