enum DeviceType {
  AVR,
  RBPY,
  OTHER,
}

export interface IDevice {
  macAdress: string,
  id?: number |string,
  name: string,
  type?: DeviceType
}


export default class Device {
  private macAddress: string;
  private name:string;
  private type: DeviceType;
  constructor(args: IDevice) {
    this.name = args.name;
    this.macAddress = args.macAdress;
    this.type = args.type || DeviceType.OTHER
  }
  public getMacAddress(): string {
      return this.macAddress;
  }

  public setMacAddress(macAddress: string): void {
      this.macAddress = macAddress;
  }

  public getName(): string {
      return this.name;
  }

  public setName(name: string): void {
      this.name = name;
  }

  public getType(): DeviceType {
      return this.type;
  }

  public setType(type: DeviceType): void {
      this.type = type;
  }
}
