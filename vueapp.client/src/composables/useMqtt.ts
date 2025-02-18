import { ref } from 'vue'
import mqtt from 'mqtt'

export function useMqtt(agvId: string) {
  const isConnected = ref(false)
  let mqttClient: mqtt.MqttClient | null = null 
  let messageCallback: ((topic: string, message: string) => void) | null = null; // 메시지 콜백 함수 저장

  let topic: string = '';

  // 연결 함수
  const connect = () => {
    if (mqttClient) {
      console.log('Already connected');
      return;
    }

    mqttClient = mqtt.connect('ws://127.0.0.1:8083/mqtt', {
      clientId: `agv-${agvId}-${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });

    mqttClient.on('connect', () => {
      console.log(`AGV ${agvId} connected to MQTT`);
      isConnected.value = true;

      topic = `${agvId}.ACS`;
      mqttClient?.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`AGV ${agvId} subscribed to topic: ${topic}`);
        }
      });

      // 연결된 후 콜백 등록이 있다면 메시지 리스닝 시작
      mqttClient?.on('message', (topic, message) => {
        messageCallback?.(topic, message.toString());
      });
    });

    mqttClient.on('error', (err) => {
      console.error(`AGV ${agvId} MQTT connection error:`, err);
      isConnected.value = false;
    });
  }

  // 연결 해제 함수
  const disconnect = () => {
    if (mqttClient) {
      mqttClient.end(() => {
        console.log(`AGV ${agvId} disconnected from MQTT`);
        isConnected.value = false;
        mqttClient = null;
      });
    }
  }

  // 구독 함수
  const subscribe = (topic: string) => {
    if (mqttClient && isConnected.value) {
      mqttClient.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`Subscribed to ${topic}`);
        }
      });
    }
  }

  // 메시지 발행 함수
  const publish = (message: string) => {
    if (mqttClient && isConnected.value) {
      mqttClient.publish(topic, message, (err) => {
        if (err) {
          console.error(`Failed to publish message to ${topic}:`, err);
        } else {
          console.log(`Message published to ${topic}: ${message}`);
        }
      });
    } else {
      console.error('Cannot publish message: MQTT client is not connected');
    }
  }

  // 메시지 수신 함수 (콜백)
  const onMessage = (callback: (topic: string, message: string) => void) => {
    messageCallback = callback;

    if (mqttClient && isConnected.value) {
      mqttClient.on('message', (topic, message) => {
        callback(topic, message.toString());
      });
    }
  }

  return { connect, disconnect, subscribe, publish, onMessage, isConnected };
}
