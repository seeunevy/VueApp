
export default class AGV {
  id: string;
  connected: boolean;
  status: string;
  location: { x: number; y: number };

  constructor(id: string) {
    this.id = id;
    this.connected = false;
    this.status = '';
    this.location = { x: 0, y: 0};
  }
}
