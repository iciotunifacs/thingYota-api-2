import UseCase from "../shared/usecase/UseCase"

import UserRepository from "../../infra/repository/UserRepository/IUserRepository"
import { User } from "../entity/User"

export default class CreateUser implements UseCase<User> {
	readonly userRepository: UserRepository
	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository
	}
	async execute(params: User): Promise<User> {
		try {
			const user = params
			return await this.userRepository.create(user)
		} catch (error) {
			throw new Error(`${error ?? "must be invalid"}`)
		}
	}
}
