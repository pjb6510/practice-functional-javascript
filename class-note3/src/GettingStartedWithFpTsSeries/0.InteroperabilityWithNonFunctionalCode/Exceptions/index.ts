import { Either, tryCatch } from 'fp-ts/lib/Either';

// 에러를 던질 수 있는 경우: Either(값)

export function parseJson<R = unknown>(json: string): Either<Error, R> {
  return tryCatch(
    () => JSON.parse(json),
    (error) => new Error(String(error))
  );
}
