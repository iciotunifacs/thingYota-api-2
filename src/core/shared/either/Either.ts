export interface ILeft<A> {
  tag: 'left',
  value: A
}

export interface IRight<B> {
  tag: 'right',
  value: B
}

type Either<A,B> = ILeft<A> | IRight<B>

export default Either
