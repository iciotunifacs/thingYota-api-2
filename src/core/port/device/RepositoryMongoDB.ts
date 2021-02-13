import Either, {Left, Right}  from '../../shared/either/'
import Device, {IDevice} from '../../device/Device'
import IDeviceRepo, { IDeviceOptions } from './Repository';
import DeviceScheme from '../../../model/device.js';

export default class DeviceRepoMongo implements IDeviceRepo {
  async find(args: IDevice, opts: IDeviceOptions): Promise<Either<Error, Device[]>> {
    try {
      const data = await DeviceScheme.find(args).populate("Sensors").populate("Actors").exec()
      return Right<Device[]>(data.map((i: any) => new Device(i)));
    } catch (error) {
      return Left<Error>(new Error(error))
    }
  }
  async findOne(id: string | number): Promise<Either<Error, Device>> {
    try {
      const data = await DeviceScheme.findById(id).populate("Sensors").populate("Actors").exec();
      if (data) {
        return Right<Device>(new Device({macAdress: data.macAdress, name: data.name, type: data?.type}));
      } else {
        return Left<Error>(new Error('Not found'))
      }
    } catch (error) {
      return Left<Error>(new Error(error))
    }
  }
  create(args: IDevice): Promise<Either<Error, Device>> {
    throw new Error('Method not implemented.');
  }
  update(args: IDevice, conditions: IDevice): Promise<Either<Error, Device[]>> {
    throw new Error('Method not implemented.');
  }

}
