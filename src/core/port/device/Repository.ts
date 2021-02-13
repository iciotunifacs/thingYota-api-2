import Either from '../../shared/either/'
import IPagination from '../../shared/pagination/'
import Device, {IDevice} from '../../device/Device'

export interface IDeviceOptions extends IPagination {}
export default interface IDeviceRepo {
  find(args:IDevice, opts:IDeviceOptions): Promise<Either<Device[], Error>>
  findOne(id: string | number): Promise<Either<Device, Error>>
  create(args:IDevice): Promise<Either<Device, Error>>
  update(args: IDevice,conditions:IDevice): Promise<Either<Device[], Error>>
}
