import * as FpNumber from 'fp-ts/lib/number';
import { getEq, isSome, none, some } from 'fp-ts/lib/Option';
import { range } from '../../../util/generators';
import { findIndex } from '..';

describe('findIndex Test (Sentienls)', () => {
  const iter = range(1, 10);
  const Eq = getEq(FpNumber.Eq);

  it('findIndex함수가 존재하는 값을 찾음', () => {
    const result = findIndex((value: number) => value === 5, iter);
    expect(isSome(result)).toBeTruthy();
    expect(Eq.equals(result, some(4))).toBeTruthy();
  });
  it('findIndex함수가 값을 찾지 못했을 경우', () => {
    const result = findIndex((value: number) => value === 15, iter);
    expect(isSome(result)).toBeFalsy();
    expect(Eq.equals(result, none)).toBeTruthy();
  });
});
