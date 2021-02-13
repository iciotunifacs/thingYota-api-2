import {IRight}from './Either'

export default function<B>(val: B): IRight<B> {
  return {value: {...val}, tag: 'right'}
}
