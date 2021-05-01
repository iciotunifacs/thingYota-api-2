export type UseCaseType<T> = T | Promise<T>

export default interface UseCase<T> {
	execute(params?: any): UseCaseType<T>
}
