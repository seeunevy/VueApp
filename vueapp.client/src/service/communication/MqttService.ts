import mqtt from 'mqtt'
import type { Ref } from 'vue'
import { ref } from 'vue'
import type { IMqttService } from '@/service/communication/IMqttService'

export class MqttService implements IMqttService {
  private mqttClient: mqtt.MqttClient | null = null;
  private messageCallback: ((topic: string, message: string) => void) | null = null;

  public _connected: Ref<boolean> = ref(false);
  public get Connected(): boolean {
    return this._connected.value;
  }

  private RId: string;

  constructor(RId: string) {
    this.RId = RId;
  }

  get TopicForSend(): string {
    return `ACS.${this.RId}`;
  }

  get TopicForReceive(): string {
    return `${this.RId}.ACS`;
  }

  connect() {
    if (this.mqttClient) {
      console.log('Already connected');
      return;
    }

    this.mqttClient = mqtt.connect('ws://127.0.0.1:8083/mqtt', {
      clientId: `agv-${this.RId}-${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });

    this.mqttClient.on('connect', () => {
      console.log(`AGV ${this.RId} connected to MQTT`);
      this._connected.value = true;

      this.mqttClient?.subscribe(this.TopicForReceive, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${this.TopicForReceive}:`, err);
        } else {
          console.log(`Subscribed to ${this.TopicForReceive}`);
        }
      });

      // 메시지 리스닝
      this.mqttClient?.on('message', (topic, message) => {
        this.messageCallback?.(topic, message.toString());
      });
    });

    this.mqttClient.on('error', (err) => {
      console.error(`AGV ${this.RId} MQTT connection error:`, err);
      this._connected.value = false;
    });
  }

  disconnect() {
    if (this.mqttClient) {
      this.mqttClient.end(() => {
        console.log(`AGV ${this.RId} disconnected from MQTT`);
        this._connected.value = false;
        this.mqttClient = null;
      });
    }
  }

  subscribe(topic: string) {
    if (this.mqttClient && this._connected.value) {
      this.mqttClient.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`Subscribed to ${topic}`);
        }
      });
    }
  }

  publish(message: string) {
    if (this.mqttClient && this._connected.value) {
      this.mqttClient.publish(this.TopicForSend, message, (err) => {
        if (err) {
          console.error(`Failed to publish message to ${this.TopicForSend}:`, err);
        } else {  
          console.log(`Message published to ${this.TopicForSend}: ${message}`);
        }
      });
    } else {
      console.error('Cannot publish message: MQTT client is not connected');
    }
  }

  onMessage(callback: (topic:string, message: string) => void) {
    this.messageCallback = callback;

    if (this.mqttClient && this._connected.value) {
      this.mqttClient.on('message', (topic, message) => {
        callback(topic, message.toString()); 
      });
    }
  }
}
