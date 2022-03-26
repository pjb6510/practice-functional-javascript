import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/lib/function';

describe('Composing Functions', () => {
  type InitialError = string;
  type NotEvenError = string;

  const initialError = (): InitialError => 'this is an initial Error';
  const notEvenError = (num: number): NotEvenError => `${num} is not even`;

  it('chainW(bindW)', () => {
    // chain function changes only value(right)
    // chainW function changes value and error(right and left)
    // W means widen.

    const rightEvenValue = E.right(2);
    const rightOddValue = E.right(3);
    const leftValue = E.left(initialError());

    const doubleIfEven = (n: number): E.Either<NotEvenError, number> =>
      n % 2 === 0 ? E.right(2 * n) : E.left(notEvenError(n));

    const result1 = pipe(rightEvenValue, E.chainW(doubleIfEven));
    const result2 = pipe(rightOddValue, E.chainW(doubleIfEven));
    const result3 = pipe(leftValue, E.chainW(doubleIfEven));

    expect(result1).toEqual(E.right(4));
    expect(result2).toEqual(E.left(notEvenError(3)));
    expect(result3).toEqual(E.left(initialError()));
  });

  it('chianFirst', () => {
    // chianFirst, chainFirstW

    const doubleAndTellIfEven = (n: number): E.Either<NotEvenError, string> =>
      n % 2 === 0
        ? E.right(`${2 * n} is an even number!`)
        : E.left(notEvenError(n));

    const rightEvenValue = E.right(2);
    const rightOddValue = E.right(3);

    const result1 = pipe(
      rightEvenValue,
      E.chainFirstW(doubleAndTellIfEven), // this goes right branch, but we drop the string returned and pass the initial value
      E.getOrElse(() => 0) // here we get the original 2
    );

    const result2 = pipe(
      rightOddValue,
      E.chainFirstW(doubleAndTellIfEven), // this goes left branch due to failed validation
      E.getOrElse(() => 0) // here we get default 0
    );

    expect(result1).toEqual(2);
    expect(result2).toEqual(0);
  });

  it('TaskEither chaining', () => {
    // We can use a function
    // that returns either value
    // in TaskEither chaining
    // with chainEitherK/chainEitherKW

    const rightEvenValue = TE.right(2);
    const rightOddValue = TE.right(3);

    const doubleIfEven = (n: number): E.Either<NotEvenError, number> =>
      n % 2 === 0 ? E.right(2 * n) : E.left(notEvenError(n));

    const result1 = pipe(rightEvenValue, TE.chainEitherKW(doubleIfEven));
    const result2 = pipe(rightOddValue, TE.chainEitherKW(doubleIfEven));

    result1().then((value) => expect(value).toEqual(E.right(4)));
    result2().then((value) => expect(value).toEqual(E.left(notEvenError(3))));
  });
});
