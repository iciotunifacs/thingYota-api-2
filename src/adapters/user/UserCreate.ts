import User, { UserObjectParams } from "../../core/entity/User"

export default class UxserCreateAdapter {
	static async create(params: UserObjectParams) {
		const user = new User(params)
		try {
			await user.build()
			return user
		} catch (error) {
			throw new Error(`${error ?? "must be invalid"}`)
		}
	}
}
