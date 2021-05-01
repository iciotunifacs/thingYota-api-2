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
	readonly password: PasswordObject
	readonly isAdmin: boolean
	constructor({
		email,
		firstname,
		lastname,
		isAdmin,
		password,
	}: UserObjectParams) {
		const response = this.preValidate({
			email,
			firstname,
			lastname,
			isAdmin,
			password,
		})

		if (response.tag == "right") {
			throw response.value
		}
		this.email = email
		this.firstname = firstname
		this.lastname = lastname
		this.isAdmin = isAdmin
		if (password.length < 6 && password.length > 32) {
			Promise.reject("erro on create password")
		}
		const salt = generateSalt(12)
		this.password = hash(password, salt)
	}

	private preValidate(params: UserObjectParams): Either<boolean, Error> {
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
