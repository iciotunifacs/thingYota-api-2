import UseCase from "../shared/usecase/UseCase"

import User, { UserObjectParams } from "../entity/User"
import UserRepository from "../../infra/repository/UserRepository/IUserRepository"

export default class CreateUser implements UseCase<User> {
	readonly userRepository: UserRepository
	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository
	}
	async execute(params: UserObjectParams) {
		try {
			const user = new User(params)
			const response = await user.validate()
			if (response.tag == "right") {
				throw response.value
			}
			return this.userRepository.create(user)
		} catch (error) {
			throw new Error(`${error ?? "must be invalid"}`)
		}
	}
}
