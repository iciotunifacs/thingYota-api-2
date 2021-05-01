import { compare, generateSalt, hash } from "../HashPassword"

describe("HashPassword", () => {
	describe("genereteSalt", () => {
		test("should a valid salt", () => {
			const result = generateSalt(10)
			expect(result).toBeDefined()
		})

		test("should have pass limit of range", () => {
			expect(() => generateSalt(300)).toThrowError(
				"300 is greater than 15,Must be less that 15",
			)
		})
	})
	describe("hash", () => {
		const resultSalt = generateSalt(10)
		test("should generate hash", () => {
			const passwirdObject = hash("myPass", resultSalt)
			expect(passwirdObject).toHaveProperty("salt")
			expect(passwirdObject).toHaveProperty("hash_password")
			expect(passwirdObject?.salt).toStrictEqual(resultSalt)
		})

		test("should recive empty string has a salt", () => {
			expect(() => hash("myPass", "")).toThrowError(
				"Must be salt or password as empty",
			)
		})

		test("should recive empty string has a password", () => {
			expect(() => hash("", resultSalt)).toThrow(
				"Must be salt or password as empty",
			)
		})
	})

	describe("compare", () => {
		const salt = generateSalt(10)
		const p1 = "teste1"
		const p2 = "idh12xVVV"
		const password1 = hash(p1, salt)
		const password2 = hash(p2, salt)
		test("should be a correct password", () => {
			const result = compare(p1, password1)
			expect(result).toBeTruthy()
		})
		test("should be a correct password using alphanumerics", () => {
			const result = compare(p2, password2)
			expect(result).toBeTruthy()
		})
		test("should be a different password", () => {
			const result = compare(p1, password2)
			expect(result).toBeFalsy()
		})
		test("should be a different password for any string", () => {
			const result = compare("teste", password2)
			expect(result).toBeFalsy()
		})
	})
})
