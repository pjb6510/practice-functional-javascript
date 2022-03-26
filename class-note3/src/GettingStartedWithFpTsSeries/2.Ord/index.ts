import { Eq } from 'fp-ts/lib/Eq';
import { contramap, fromCompare, reverse } from 'fp-ts/lib/Ord';

// Ord 타입 클래스 : 순서

type Ordering = -1 | 0 | 1;

interface Ord<T> extends Eq<T> {
  readonly compare: (x: T, y: T) => Ordering;
}

/*
  x < y: compare(x, y) : -1
  x = y: compare(x, y) : 0
  x > y: compare(x, y) : 1

  사실 동등성 개념을 포함함
*/

const ordNumber: Ord<number> = {
  equals: (x, y) => x === y,
  compare: (x, y) => (x < y ? -1 : x > y ? 1 : 0),
};

// fromCompare 헬퍼 함수

const ordNumber2: Ord<number> = fromCompare((x, y) =>
  x < y ? -1 : x > y ? 1 : 0
);

// 이를 응용한 함수

function min<T>(ord: Ord<T>): (x: T, y: T) => T {
  return (x, y) => (ord.compare(x, y) === 1 ? y : x);
}

// User를 age순으로 정렬하기
type User = {
  name: string;
  age: number;
};

const compareByAge: Ord<User> = fromCompare((a, b) =>
  ordNumber.compare(a.age, b.age)
);
const compareByAge2: Ord<User> = contramap((user: User) => user.age)(ordNumber);
const getYoungerUser = min(compareByAge);

// 반대로 하기
// getOlder 만들기
function max<T>(ord: Ord<T>): (x: T, y: T) => T {
  return min(reverse(ord));
}

const getOlder = max(compareByAge);
