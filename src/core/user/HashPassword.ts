import { randomBytes, createHmac } from "crypto"

export interface PasswordObject {
	salt: string
	hash_password: string
}
export function generateSalt(rounds = 12): string {
	if (rounds >= 15) {
		throw new Error(`${rounds} is greater than 15,Must be less that 15`)
	}
	const data = randomBytes(Math.ceil(rounds / 2)).toString("base64")
	return data.slice(0, rounds)
}

export function hasher(password: string, salt: string): PasswordObject {
	const hash = createHmac("sha512", salt)
	hash.update(password)
	const value = hash.digest("base64")
	return {
		salt: salt,
		hash_password: value,
	}
}

export function hash(password: string, salt: string): PasswordObject {
	if (password == null || salt == null) {
		throw new Error("Must Provide Password and salt values")
	}
	if (password == "" || salt == "") {
		throw new Error("Must be salt or password as empty")
	}

	return hasher(password, salt)
}

export function compare(password: string, hash: PasswordObject): boolean {
	if (!password || !hash) {
		throw new Error("password and hash is required to compare")
	}
	const passwordData = hasher(password, hash.salt)
	if (passwordData.hash_password === hash.hash_password) {
		return true
	}
	return false
}
