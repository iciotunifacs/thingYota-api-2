import {Left} from './Either'
export default function<A>(val: A): Left<A> {
  return {value: {...val}, tag: 'left'}
}
