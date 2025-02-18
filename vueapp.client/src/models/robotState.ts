export default class RobotState {
  id: string;
  connected: boolean;
  X: number;
  Y: number;
  H: number;

  constructor(id: string) {
    this.id = id;
    this.connected = false;  
    this.X = 0;               
    this.Y = 0;               
    this.H = 0;               
  }
}
