import Either from "./either/Either"

export default abstract class Entity<T, P> {
	public abstract validation(params: P): Either<Error, boolean>
	public abstract create(params: P): T
}
