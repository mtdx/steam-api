import 'jest';
import { sum } from '../sum';

describe('#sum()', () => {
  it('returns the sum of 2 numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
