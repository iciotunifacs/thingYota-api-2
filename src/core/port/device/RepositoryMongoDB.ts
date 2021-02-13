import Either from '../../shared/either/'
import IPagination from '../../shared/pagination/'
import Device, {IDevice} from '../../device/Device'
import IDeviceRepo, { IDeviceOptions } from './Repository';
import * as DeviceScheme from '../../../model/device.js';

export default class DeviceRepoMongo implements IDeviceRepo {
  find(args: IDevice, opts: IDeviceOptions): Promise<Either<Device[], Error>> {
    throw new Error('Method not implemented.');
  }
  findOne(id: string | number): Promise<Either<Device, Error>> {
    throw new Error('Method not implemented.');
  }
  create(args: IDevice): Promise<Either<Device, Error>> {
    throw new Error('Method not implemented.');
  }
  update(args: IDevice, conditions: IDevice): Promise<Either<Device[], Error>> {
    throw new Error('Method not implemented.');
  }

}
