export function toArray<V>(iter: Iterable<V>) {
  const result: V[] = [];

  for (const value of iter) {
    result.push(value);
  }

  return result;
}
