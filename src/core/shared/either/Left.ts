import {ILeft} from './Either'
export default function<A>(val: A): ILeft<A> {
  return {value: {...val}, tag: 'left'}
}
