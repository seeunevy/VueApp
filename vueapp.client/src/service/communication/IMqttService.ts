export interface IMqttService {
  connect(): void;
  disconnect(): void;
  subscribe(topic: string): void;
  publish(message: string): void;
  onMessage(callback: (message: string) => void): void;
}
