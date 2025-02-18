import { EnCommandId, EnStatus } from './Enum';

export default class ResponseGQ {
  CmdId: EnCommandId;
  Index: number;
  Type: string;
  X: number;
  Y: number;
  H: number;
  Odemetry: number;
  Mileage: number;
  State: EnStatus;
  Charging: number;
  constructor(
    CmdId: EnCommandId,
    Index: number,
    Type: string,
    X: number,
    Y: number,
    H: number,
    Odemetry: number,
    Mileage: number,
    State: EnStatus,
    Charging: number,
  )
  {
    this.CmdId = CmdId;
    this.Index = Index;
    this.Type = Type;
    this.X = X;
    this.Y = Y;
    this.H = H;
    this.Odemetry = Odemetry;
    this.Mileage = Mileage;
    this.State = State;
    this.Charging = Charging;
  }
}
