import {Right}from './Either'

export default function<B>(val: B): Right<B> {
  return {value: {...val}, tag: 'right'}
}
