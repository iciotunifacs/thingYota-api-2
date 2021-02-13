import Either from '../../shared/either/'
import IPagination from '../../shared/pagination/'
import Device, {IDevice} from '../../device/Device'

export interface IDeviceOptions extends IPagination {}
export default interface IDeviceRepo {
  find(args:IDevice, opts:IDeviceOptions): Promise<Either<Error, Device[]>>
  findOne(id: string | number): Promise<Either<Error, Device>>
  create(args:IDevice): Promise<Either<Error, Device>>
  update(args: IDevice,conditions:IDevice): Promise<Either<Error, Device[]>>
}
