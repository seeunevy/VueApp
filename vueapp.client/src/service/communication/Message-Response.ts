import { EnCommandId, EnStatus } from './Enum';
export default class ResponseGQ {
  Cmd!: EnCommandId; // !를 사용하면 해당 속성이 반드시 초기화된다고 TypeScript에게 명시적으로 알려줌
  Index!: number;
  Type!: string;
  X!: number;
  Y!: number;
  H!: number;
  Odemetry!: number;
  Mileage!: number;
  State!: EnStatus;
  Charging!: number;
  constructor() { }
  //public constructor(init?: Partial<ResponseGQ>) {
  //  Object.assign(this, init);
  //}
}


//export default class ResponseGQ {
//  CmdId: EnCommandId;
//  Index: number;
//  Type: string;
//  X: number;
//  Y: number;
//  H: number;
//  Odemetry: number;
//  Mileage: number;
//  State: EnStatus;
//  Charging: number;

//  public constructor(init?: Partial<ResponseGQ>) {
//    Object.assign(this, init);
//  }

//  //constructor(
//  //  CmdId: EnCommandId,
//  //  Index: number,
//  //  Type: string,
//  //  X: number,
//  //  Y: number,
//  //  H: number,
//  //  Odemetry: number,
//  //  Mileage: number,
//  //  State: EnStatus,
//  //  Charging: number,
//  //)
//  //{
//  //  this.CmdId = CmdId;
//  //  this.Index = Index;
//  //  this.Type = Type;
//  //  this.X = X;
//  //  this.Y = Y;
//  //  this.H = H;
//  //  this.Odemetry = Odemetry;
//  //  this.Mileage = Mileage;
//  //  this.State = State;
//  //  this.Charging = Charging;
//  //}
//}
