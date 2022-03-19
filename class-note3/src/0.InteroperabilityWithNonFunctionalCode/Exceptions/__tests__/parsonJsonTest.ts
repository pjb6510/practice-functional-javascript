import { getOrElse, isLeft, isRight } from 'fp-ts/lib/Either';
import { parseJson } from '..';

describe('parseJson 함수 테스트 (예외)', () => {
  interface ParseResult {
    a: number;
    b: number;
  }

  const success = '{"a": 1, "b": 2}';
  const fail = '{"a": 1, "b"}';

  it('parseJson 함수가 정상적으로 실행됐을 경우', () => {
    const result = parseJson<ParseResult>(success);
    expect(isRight(result)).toBeTruthy();
    expect(getOrElse(() => ({ a: 0, b: 0 }))(result)).toMatchObject({
      a: 1,
      b: 2,
    });
  });
  it('parseJson 함수 실행 중 예외가 발생했을 경우', () => {
    const result = parseJson<ParseResult>(fail);
    expect(isLeft(result)).toBeTruthy();
    expect(getOrElse(() => ({ a: 1 }))(result)).toMatchObject({
      a: 1,
    });
  });
});
