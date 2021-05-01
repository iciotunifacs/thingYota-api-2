export type UseCaseType<T> = Promise<T> | T

export default interface UseCase<T> {
	execute(params?: any): UseCaseType<T>
}
