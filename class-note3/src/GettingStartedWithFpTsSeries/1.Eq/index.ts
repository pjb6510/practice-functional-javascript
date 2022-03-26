import { contramap, struct } from 'fp-ts/lib/Eq';

// Eq 타입 클래스 : 동등성

interface Eq<T> {
  readonly equals: (a: T, b: T) => boolean;
}

// Eq 인스턴스 예시

const eqNumber: Eq<number> = {
  equals: (x, y) => x === y,
};

// Eq로 만든 createIncludes
// 특정 타입의 배열의 includes를 생성

function createIncludes<T>(eq: Eq<T>): (item: T, array: T[]) => boolean {
  return (item, array) => array.some((value) => eq.equals(item, value));
}

// 더 복잡한 타입의 Eq 인스턴스

interface Position {
  x: number;
  y: number;
}

const eqPosition: Eq<Position> = {
  equals: (position1, position2) =>
    position1.x === position2.x && position1.y === position2.y,
};

// struct로도 만들 수 있음

const eqPosition2 = struct({
  x: eqNumber,
  y: eqNumber,
});

interface Vector {
  from: Position;
  to: Position;
}

const eqVector: Eq<Vector> = struct({
  from: eqPosition,
  to: eqPosition,
});

// contramap으로도 만들 수 있음

interface User {
  userId: number;
  name: string;
}

// userId가 같으면 같은 유저
export const eqUser = contramap((user: User) => user.userId)(eqNumber);
