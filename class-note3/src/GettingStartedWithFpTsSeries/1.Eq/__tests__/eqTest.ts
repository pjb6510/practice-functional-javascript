import { eqUser } from '..';

describe('eqTest', () => {
  it('eqUser Test', () => {
    expect(
      eqUser.equals(
        { userId: 1, name: 'awefawef' },
        { userId: 1, name: 'zxcvszcv' }
      )
    ).toBeTruthy();

    expect(
      eqUser.equals(
        { userId: 2, name: 'zxcvszcv' },
        { userId: 1, name: 'zxcvszcv' }
      )
    ).toBeFalsy();
  });
});
