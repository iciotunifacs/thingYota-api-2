import validator from "validator"
import Either from "../shared/either"
import Left from "../shared/either/Left"
import Right from "../shared/either/Right"
import { generateSalt, hash, PasswordObject } from "../user"

export interface UserObjectParams {
	firstname: string
	lastname: string
	email: string
	isAdmin: boolean
	password: string
}

export default class User {
	readonly firstname: string
	readonly lastname: string
	readonly email: string
	private passwordObject: PasswordObject = { hash_password: "", salt: "" }
	private password: string
	readonly isAdmin: boolean
	constructor({
		email,
		firstname,
		lastname,
		isAdmin,
		password,
	}: UserObjectParams) {
		this.email = email
		this.firstname = firstname
		this.lastname = lastname
		this.isAdmin = isAdmin
		this.password = password
	}

	async build() {
		const { tag, value } = this.validate()
		if (tag == "right") {
			throw value
		}
		this.passwordObject = hash(this.password, generateSalt(12))
	}

	getPassword() {
		return this.passwordObject
	}

	validate(): Either<boolean, Error> {
		for (const key in this) {
			const value = this[key]
			switch (key) {
				case "email":
					if (!validator.isEmail(`${value}`)) {
						return Right(new Error("must be a valid email"))
					}
					break
				case "password":
					{
						if (`${value}`.length < 6 || `${value}`.length > 32) {
							return Right(new Error("must be a valid password"))
						}
					}
					break
			}
		}
		return Left(true)
	}
}
