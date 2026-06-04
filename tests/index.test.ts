import { bestGuess, narrowDownPossibleWords } from 'jotto';
import { noRepeatedLetters } from 'no-repeated-letters';
import sowpodsFive from 'sowpods-five';
import sowpodsSix from 'sowpods-six';
import { describe, expect, it } from 'vitest';

describe('narrowDownPossibleWords', () => {
  it('is a function', () => {
    expect(typeof narrowDownPossibleWords).toBe('function');
  });
});

describe('bestGuess', () => {
  it('is a function', () => {
    expect(typeof bestGuess).toBe('function');
  });

  it('calculates best guess for five-letter words', () => {
    const TEST_GUESSES: [Record<string, number>, string][] = [
      [{ bread: 0 }, 'tying'],
      [{ bread: 1 }, 'algin'],
      [{ bread: 2 }, 'parts'],
      [{ bread: 3 }, 'biros'],
      [{ bread: 4 }, 'boils'],
      [{ bread: 1, anvil: 2 }, 'irone'],
      [{ abcde: 1, fghij: 1, klmno: 1, pqrst: 1, uvwxy: 1 }, 'riley'],
    ];

    const words = sowpodsFive.filter(noRepeatedLetters);
    for (const [guesses, expected] of TEST_GUESSES) {
      const possibleWords = narrowDownPossibleWords(words, guesses);
      expect(bestGuess(words, possibleWords)).toBe(expected);
    }
  });

  it('works with six-letter words', () => {
    const TEST_GUESSES: [Record<string, number>, string][] = [
      [{ charts: 0 }, 'puking'],
      [{ charts: 1 }, 'gamins'],
      [{ charts: 2 }, 'ingots'],
      [{ charts: 3 }, 'chiton'],
      [{ charts: 4 }, 'chopin'],
    ];

    const words = sowpodsSix.filter(noRepeatedLetters);
    for (const [guesses, expected] of TEST_GUESSES) {
      const possibleWords = narrowDownPossibleWords(words, guesses);
      expect(bestGuess(words, possibleWords)).toBe(expected);
    }
  });
});
