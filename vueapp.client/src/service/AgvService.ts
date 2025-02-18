
import AGV from '@/models/agv';
import RobotState from '@/models/robotState';
import { watch } from 'vue';
import { MqttService } from '@/service/communication/MqttService';
import { useRobotStateStore } from '@/store/robotState';
import { EnCommandId } from './communication/Enum';
import ResponseGQ from './communication/Message-Response';

export default class AGVService {
  private agv: AGV;
  private mqttService: MqttService;
  private robotState: RobotState;

  private agvStore = useRobotStateStore();

  constructor(agv: AGV) {
    agv.connected = false;
    this.agv = agv;
    this.mqttService = new MqttService(this.agv.id);
    this.robotState = new RobotState(this.agv.id);
    this.mqttService.onMessage((topic: string, payload: ArrayBuffer | Uint8Array | string) : void => {
      let message: string;

      if (payload instanceof Uint8Array || payload instanceof ArrayBuffer) {
        message = new TextDecoder('utf-8').decode(payload);
      } else if (typeof payload === 'string') { // 문자열로 들어온다
        message = payload;
      } else {
        console.error('Unexpected payload type:', payload);
        return;
      }

      this.handleMessage(message);
    });


    // Pinia store 상태 동기화
    const agvStore = useRobotStateStore();

    watch(() => this.mqttService._connected.value, (isConnected) => {
      this.robotState.connected = isConnected
      agvStore.updateRobotState(this.robotState)
    });
  }

  // Receive
  private handleMessage(message: string) {
    console.log(`AGV ${this.agv.id} received message:`, message);

    const msg = this.ParsePacket(message);

    if (msg == null) {
      console.log(`Unknown Message: ${msg}`);
    }
    else {
      switch (msg.Cmd) {
        case EnCommandId.GQ: {
          const gq = msg as ResponseGQ;
          this.robotState.X = gq.X;
          this.robotState.Y = gq.Y;
          this.robotState.H = gq.H;

          this.agvStore.updateRobotState(this.robotState);
        }
      }
    }
  }

  private ParsePacket(message: string) {

    const json = JSON.parse(message);
    const cmdValue: string = json["Cmd"];
    let result: EnCommandId | undefined;

    if (Object.values(EnCommandId).includes(cmdValue as EnCommandId)) {
      result = EnCommandId[cmdValue as keyof typeof EnCommandId];

      switch (result) {
        case EnCommandId.GQ:
          //return json as ResponseGQ; // [X] : TypeScript는 타입 캐스팅(as ResponseGQ)만으로 해당 타입을 보장하지 않음
          return Object.assign(new ResponseGQ(), json);
        default:
          break;
      }
    }
  }

  send(message: string) {
    this.mqttService.publish(message);
  }

  connect() {
    this.mqttService.connect();
  }

  disconnect() {
    this.mqttService.disconnect();
  }

  getAgvStatus() {
    return this.agv.status;
  }
}
