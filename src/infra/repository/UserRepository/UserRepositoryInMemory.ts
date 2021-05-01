import User from "../../../core/entity/User"
import IUserRepository, { UserObjectFilter } from "./IUserRepository"

export default class UserInMemoryRepository implements IUserRepository {
	readonly stack: User[] = []

	findOne(params: UserObjectFilter): Promise<User | undefined> {
		return Promise.reject("not implrmrnted")
	}
	create(params: User): Promise<User> {
		this.stack.push(params)
		return Promise.resolve(params)
	}

	clear() {
		this.stack.splice(0, this.stack.length)
	}
}
