export interface Left<A> {
  tag: 'left',
  value: A
}

export interface Right<B> {
  tag: 'right',
  value: B
}

type Either<A,B> = Left<A> | Right<B>

export default Either
