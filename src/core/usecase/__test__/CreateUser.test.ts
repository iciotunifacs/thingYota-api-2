import { compare } from "../../user"
import UxserCreateAdapter from "../../../adapters/user/UserCreate"
import UserInMemoryRepository from "../../../infra/repository/UserRepository/UserRepositoryInMemory"
import CreateUser from "../CreateUser"

describe("CreateUser", () => {
	const userRepository = new UserInMemoryRepository()
	beforeEach(() => {
		userRepository.clear()
	})
	test("should be create user", async () => {
		const usecase = new CreateUser(userRepository)
		const user = await usecase.execute(
			UxserCreateAdapter.create({
				firstname: "Victor",
				lastname: "Raton",
				email: "vfbraton@gmail.com",
				isAdmin: false,
				password: "vfbr1101",
			}),
		)
		expect(user.password).toBeDefined()
		expect(compare("vfbr1101", user.password))
		expect(user.email).toBe("vfbraton@gmail.com")

		expect(userRepository.stack).toHaveLength(1)
		expect(userRepository.stack).toContainEqual(user)
	})
	test("should be not create user invalid email", async () => {
		const usecase = new CreateUser(userRepository)
		expect(async () => {
			await usecase.execute(
				UxserCreateAdapter.create({
					firstname: "Victor",
					lastname: "Raton",
					email: "vfbratongmail.com",
					isAdmin: false,
					password: "vfbr1101",
				}),
			)
		}).rejects.toThrowError("vfbratongmail.com is not valid email")

		expect(userRepository.stack).toHaveLength(0)
	})
	test("should be not create user invalid password", async () => {
		const usecase = new CreateUser(userRepository)
		expect(
			async () =>
				await usecase.execute(
					UxserCreateAdapter.create({
						firstname: "Victor",
						lastname: "Raton",
						email: "vfbraton@gmail.com",
						isAdmin: false,
						password: "vf",
					}),
				),
		).rejects.toThrow(
			"vf is a not valid password, shoud be a greather than 6 and less than 32 caracteres",
		)

		expect(userRepository.stack).toHaveLength(0)
	})
})
