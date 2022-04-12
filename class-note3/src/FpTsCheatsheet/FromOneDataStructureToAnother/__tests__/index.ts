import * as E from 'fp-ts/Either';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';

describe('From one data structure to another', () => {
  it('Flipping data structures', () => {
    // e.g.) Array<Either<E, A>> -> Either<E, Array<A>>
    // e.g.) Option<TaskEither<E, A>> -> TaskEither<E, Option<A>>
    // Use Sequence

    const someError = new Error('some error');

    const arrayOfEither: Array<E.Either<Error, number>> = [
      E.right(42),
      E.left(someError),
      E.right(1337),
    ];

    const eitherOfArray: E.Either<Error, number[]> = A.sequence(E.Applicative)(
      arrayOfEither
    );

    expect(E.isLeft(eitherOfArray)).toBeTruthy();
    // eitherOfArray: E.Either<Error, number[]> == either.left(SomeError)

    const arrayofRight = [E.right(24), E.right(1335)];
    const eitherOfArray2 = A.sequence(E.Applicative)(arrayofRight);
    expect(E.isRight(eitherOfArray2)).toBeTruthy();
    // eitherOfArray2: E.Either<Error, number[]> == either.right([24, 1335])

    const optionOfTaskEither = O.some(TE.right(42));
    // O.Option<TE.TaskEither<SomeError, number>>
    const taskEitherOfOption = O.sequence(TE.ApplicativeSeq)(
      optionOfTaskEither
    );
    // TE.TaskEither<SomeError, Option<number>>
  });

  it('Applying functions returning another data type', () => {
    type UserID = string;
    type UserNotFound = Error;
    type UserPreferences = { color: string };

    // in this case

    /*
    const getUserPreferences: (userId: UserID) => TE.TaskEither<UserNotFound, UserPreferences> 
    const optionUserId = O.some(userId)

    pipe(
      optionUserId,
      option.map(getUserPreferences) // this will give you an Option<TaskEither.right(userPreferences)>
    )
    */

    // but maybe, you want TaskEither not Option because you want chain it with other TaskEither or whatever reason
    // Use traverse

    const getUserPreference = (userId: UserID) => TE.right({ color: 'green' });
    const optionUserId = O.some('pjb6510');

    const result = O.traverse(TE.ApplicativeSeq)(getUserPreference)(
      optionUserId
    );

    const result2 = pipe(
      optionUserId,
      O.traverse(TE.ApplicativeSeq)(getUserPreference)
    ); // this is same as above.

    expect(result()).toEqual(result2());
  });

  // TODO: https://github.com/inato/fp-ts-cheatsheet#applying-a-function-to-an-array-of-elements
});
