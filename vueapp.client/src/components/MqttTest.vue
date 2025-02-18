<template>
  <div>
    This is MQTTTest View
    <div class="state-wrap" v-for="agv in robotStates" :key="agv.id">
      <h2>AGV {{ agv.id }} MQTT Status: {{ agv.connected ? '✅ Connected' : '❌ Disconnected' }}</h2>
        <button @click="connect(agv.id)">📡 Connect</button>
        <button @click="disconnect(agv.id)">📡 Disconnect</button>
        <button @click="sendMessage(agv.id)">🚀 Publish</button>
      </div>
    </div>
</template>

<script setup>
  import { useRobotStateStore } from '@/store/robotState';
  import { getAgvService } from '@/service/AgvServiceManager'
  import { toRaw } from 'vue'
  import { storeToRefs } from 'pinia'

  const agvStore = useRobotStateStore();
  const { robotStates } = storeToRefs(agvStore);

  const connect = (agvId) => {
    const client = getAgvService(agvId);
    if (client) {
      client.connect();
    } else {
      console.error(`AGV service with ID ${agvId} not found.`);
    }
  };

  const disconnect = (agvId) => {
    const client = getAgvService(agvId);
    if (client) {
      client.disconnect();
    } else {
      console.error(`AGV service with ID ${agvId} not found.`);
    }
  };

  const sendMessage = (agvId) => {
    const message = 'Test message for AGV ' + agvId;
  };
</script>

<style>
  .state-wrap {
    margin-bottom: 10px;
  }
</style>
