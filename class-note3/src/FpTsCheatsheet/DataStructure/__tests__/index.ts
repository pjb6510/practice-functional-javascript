import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/lib/function';

const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });

describe('Option', () => {
  it('fromPredicate', () => {
    const isEven = (n: number) => n % 2 === 0;

    const noneValue = O.fromPredicate(isEven)(3);
    const someValue = O.fromPredicate(isEven)(4);

    expect(O.isSome(noneValue)).toBeFalsy();
    expect(O.isSome(someValue)).toBeTruthy();
  });

  it('Get value from an Option', () => {
    const noneValue = O.none;
    const someValue = O.of('value');

    expect(O.toUndefined(noneValue)).toBe(undefined);
    expect(O.toUndefined(someValue)).toBe('value');
    expect(O.toNullable(noneValue)).toBe(null);
    expect(O.toNullable(someValue)).toBe('value');
  });
});

describe('Either', () => {
  it('fromPredicate', () => {
    type EvenNumber = number;
    const isEven = (n: number): n is EvenNumber => n % 2 === 0;
    const eitherBuilder = E.fromPredicate(
      isEven,
      (n: number) => `${n} is odd number`
    );

    const leftValue = eitherBuilder(3);
    const rightValue = eitherBuilder(4);

    expect(E.isRight(rightValue)).toBeTruthy();
    expect(E.isLeft(leftValue)).toBeTruthy();
  });

  it('getOrElse', () => {
    const leftValue = E.left(3);
    const rightValue = E.right(4);

    expect(E.getOrElse(() => 0)(leftValue)).toBe(0);
    expect(E.getOrElse(() => 0)(rightValue)).toBe(4);
  });
});

describe('TaskEither', () => {
  // https://stackoverflow.com/questions/52673682/how-do-i-test-promise-delays-with-jest

  // TaskEither<E, A> is strictly equivalent to Task<Either<E, A>>

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('build', () => {
    // left ,right, fromNullable, fromPredicate
    const leftValue = TE.left('value');
    const rightValue = TE.right('value');
  });

  it('tryCatch', async () => {
    const asyncIsEven = async (number: number) => {
      await delay(500);

      if (number % 2 !== 0) {
        throw new Error('ODD');
      }

      return number;
    };

    const buildTaskEither = (number: number) =>
      TE.tryCatch(
        () => asyncIsEven(number),
        () => `${number} is odd`
      );

    const rightValue = buildTaskEither(4);
    const leftValue = buildTaskEither(3);

    rightValue()
      .then((either) => {
        console.log(either);
        return either;
      })
      .then((either) => expect(E.getOrElse(() => 0)(either)).toBe(4));
    leftValue()
      .then((either) => {
        console.log(either);
        return either;
      })
      .then((either) => expect(E.getOrElse(() => 0)(either)).toBe(0));

    jest.advanceTimersByTime(1000);
  });
});

describe('Array and ReadonlyArray', () => {
  it('filter and map in one go', () => {
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    const result = pipe(
      array,
      RA.filter((n) => n % 2 === 0),
      RA.map((a) => a ** 2)
    );

    const transformData = flow(
      RA.filter((n: number) => n % 2 === 0),
      RA.map((a) => a ** 2)
    );

    expect(result).toEqual([0, 4, 16, 36, 64]);
    expect(transformData(array)).toEqual([0, 4, 16, 36, 64]);
  });
});
