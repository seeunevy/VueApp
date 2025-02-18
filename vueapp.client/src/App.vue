<script setup lang="ts">
  import HelloWorld from './components/HelloWorld.vue'
  import TheWelcome from './components/TheWelcome.vue'
  import MQTTTest from './components/MQTTTest.vue'
  import NavBar from './components/NavBar.vue'
  import AGV from '@/models/agv';
  import { ref, onMounted } from 'vue';
</script>

<template>
  <header>
    <div>
      <NavBar/>
    </div>
  </header>
  <main>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </main>
</template>

<style lang="scss">
  html, body {
    height: 100%;
    margin: 0;
  }

  #app {
    display: flex;
    flex-flow: column;
    height: 100%;
  }

  header {
    flex: 0 1 auto;
  }

  main {
    display: flex;
    flex: 1 1 auto;
  }

</style>
