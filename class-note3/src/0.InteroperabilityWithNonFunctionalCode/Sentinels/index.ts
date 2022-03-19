import { fromNullable, none, Option, some } from 'fp-ts/lib/Option';
import { toArray } from '../../util/iteratorUtils';

// undefined나 null을 던질 수 있는 경우 Option(값)

export function findIndex<V>(
  func: (v: V) => boolean,
  iter: Iterable<V>
): Option<number> {
  const index = toArray(iter).findIndex(func);
  return index === -1 ? none : some(index);
}

export function find<V>(func: (v: V) => boolean, iter: Iterable<V>): Option<V> {
  const value = toArray(iter).find(func);
  return fromNullable(value);
}
