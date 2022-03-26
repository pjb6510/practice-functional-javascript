import { IO } from 'fp-ts/lib/IO';

// 사이드 이펙트를 일으킬 경우: IO(함수)

export const createRandom: IO<number> = () => Math.random();
