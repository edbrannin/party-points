import { byIndex, nextBelowIndex } from './People';

const Ed = {
  name: 'Ed',
  values: [1],
  sum: 1,
};
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


describe('byIndex', () => {
  it('works with one element', () => {
    const input = {
      people: [Ed],
      total: 1,
    };
    const expected = [];
    expected[0] = 'Ed';
    expect(byIndex(input)).toEqual(expected);
  });

  it('works with two elements', () => {
    const input = {
      people: [Ed, Jen],
      total: 4,
    };
    const expected = [];
    expected[0] = 'Ed';
    expected[1] = 'Jen';
    expect(byIndex(input)).toEqual(expected);
  });

  it('works with three elements', () => {
    const input = {
      people: [Ed, Jen, Bridget],
      total: 14,
    };
    const expected = [];
    expected[0] = 'Ed';
    expected[1] = 'Jen';
    expected[4] = 'Bridget';
    expect(byIndex(input)).toEqual(expected);
  });
});

describe('nextBelowIndex', () => {
  it('should return the highest result below the given index', () => {
    const input = {
      people: [Ed, Jen, Bridget],
      total: 14,
    };
    expect(nextBelowIndex(input, 0)).toEqual('Ed');
    expect(nextBelowIndex(input, 1)).toEqual('Jen');
    expect(nextBelowIndex(input, 2)).toEqual('Jen');
    expect(nextBelowIndex(input, 3)).toEqual('Jen');
    expect(nextBelowIndex(input, 4)).toEqual('Bridget');
    expect(nextBelowIndex(input, 5)).toEqual('Bridget');
  });
});
