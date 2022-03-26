import { createRandom } from '..';

describe('random함수 테스트 (랜덤)', () => {
  it('Math.random함수를 mocking해 테스트하기', () => {
    Math.random = jest.fn().mockReturnValue(0.5);
    const result = createRandom();
    expect(result).toBe(0.5);
  });
});
