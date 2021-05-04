import { User } from "../../../core/entity/User"

export interface UserObjectFilter {
	firstname?: string
	lastname?: string
	email?: string
	isAdmin?: boolean
	password?: string
}
export default interface IUserRepository {
	findOne(params: UserObjectFilter): Promise<User | undefined>
	create(params: User): Promise<User>
}
