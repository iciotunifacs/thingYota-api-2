/* eslint-disable indent */
import validator from "validator"
import Either from "../shared/either"
import Entity from "../shared/entity"
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

export class User {
	public firstname: string
	public lastname: string
	public email: string
	public password: PasswordObject = { hash_password: "", salt: "" }
	public isAdmin: boolean
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
		this.password = hash(password, generateSalt(12))
	}
}

export default class UserEntity extends Entity<User, UserObjectParams> {
	validation(params: UserObjectParams): Either<Error, boolean> {
		for (const key in params) {
			switch (key) {
				case "email":
					if (!validator.isEmail(params[key])) {
						return Left(new Error(`${params[key]} is not valid email`))
					}
					break
				case "password":
					if (!validator.isAlphanumeric(params[key])) {
						return Left(
							new Error(
								`${params[key]} is a not valid password, shoud be a alphanumeric`,
							),
						)
					}
					if (params[key].length < 6 || params[key].length > 32) {
						return Left(
							new Error(
								`${params[key]} is a not valid password, shoud be a greather than 6 and less than 32 caracteres`,
							),
						)
					}
					break
			}
		}
		return Right(true)
	}
	create(params: UserObjectParams): User {
		const result = this.validation(params)
		if (result.tag == "left") {
			throw result.value
		}
		return new User(params)
	}
}
