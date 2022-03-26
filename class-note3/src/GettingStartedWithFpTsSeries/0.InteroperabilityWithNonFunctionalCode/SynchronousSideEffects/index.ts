import { IO } from 'fp-ts/lib/IO';
import { fromNullable, Option } from 'fp-ts/lib/Option';
import { IOEither, tryCatch } from 'fp-ts/IOEither';
import * as fs from 'fs';

// 사이드 이펙트를 일으키는 경우: IO(함수)

export function getItemFromLocalStorage(key: string): IO<Option<string>> {
  return () => fromNullable(localStorage.getItem(key));
}

// 사이드 이펙트를 일으키는데 에러를 던질 수도 있는 경우: IOEither(함수)

export function readFileSync(path: string): IOEither<Error, string> {
  return tryCatch(
    () => fs.readFileSync(path, 'utf8'),
    (reason) => new Error(String(reason))
  );
}
