import User from "../../../core/entity/User"
import IUserRepository, { UserObjectFilter } from "./IUserRepository"

export default class UserInMemoryRepository implements IUserRepository {
	findOne(params: UserObjectFilter): User | undefined {
		throw new Error("Method not implemented.")
	}
	readonly stack: User[] = []

	create(params: User): User {
		this.stack.push(params)
		return params
	}

	clear() {
		this.stack.splice(0, this.stack.length)
	}
}
