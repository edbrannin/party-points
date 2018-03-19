import { parseText } from './PointsInput';

const Ed = {
  name: 'Ed',
  values: [1],
  sum: 1,
};
/*
const Jen = {
  name: 'Jen',
  values: [1, 2],
  sum: 3,
};
const Bridget = {
  name: 'Bridget',
  values: [5, 5],
  sum: 10,
};
*/

describe('parseText', () => {
  it('should parse one line', () => {
    const input = 'Ed 1';
    const output = parseText(input);
    expect(output).toEqual({
      people: [
        Ed,
      ],
      total: 1,
    });
  });
});

