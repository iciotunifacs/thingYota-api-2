import User from "../../../core/entity/User"

export interface UserObjectFilter {
	firstname?: string
	lastname?: string
	email?: string
	isAdmin?: boolean
	password?: string
}
export default interface IUserRepository {
	findOne(params: UserObjectFilter): User | undefined
	create(params: User): User
}
