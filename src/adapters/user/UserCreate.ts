import UserEntity, { UserObjectParams } from "../../core/entity/User"

export default class UxserCreateAdapter {
	static create(params: UserObjectParams) {
		const user = new UserEntity().create(params)
		return user
	}
}
