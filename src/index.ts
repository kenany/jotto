import jots from 'jots';

/**
 * Computes the frequency distribution of scores for a given guess against all
 * possible words.
 */
function guessResults(
  possibleWords: readonly string[],
  guess: string
): number[] {
  const results = [0, 0, 0, 0, 0, 0, 0];
  for (const word of possibleWords) {
    results[jots(word, guess)] += 1;
  }
  return results;
}

/**
 * Computes the weighted average score for a guess. Lower values indicate a
 * guess that more evenly partitions the remaining possibilities.
 */
function guessValue(possibleWords: readonly string[], guess: string): number {
  const results = guessResults(possibleWords, guess);

  let average = 0;
  let sum = 0;
  for (const i of results) {
    average += i ** 2;
    sum += i;
  }

  return average / sum;
}

/**
 * Narrows down possible solutions based on previous guesses and their scores.
 *
 * @param words Valid words to filter from.
 * @param previousGuesses An object mapping each previous guess to the number
 *   of jots (letters in common) it scored.
 * @returns The subset of `words` consistent with all previous guesses.
 */
export function narrowDownPossibleWords(
  words: readonly string[],
  previousGuesses: Record<string, number>
): string[] {
  return words.filter((word) =>
    Object.entries(previousGuesses).every(
      ([guess, score]) => jots(word, guess) === score
    )
  );
}

/**
 * Determines the best next guess by finding the word that most evenly
 * partitions the remaining possibilities.
 *
 * @param words The full set of valid words to choose a guess from.
 * @param possibleWords The current set of words that could be the answer.
 * @returns The word from `words` that minimizes the weighted average partition
 *   size.
 */
export function bestGuess(
  words: readonly string[],
  possibleWords: readonly string[]
): string {
  let best: string | undefined;
  let bestValue = Number.POSITIVE_INFINITY;

  for (const guess of words) {
    const value = guessValue(possibleWords, guess);
    if (value < bestValue) {
      bestValue = value;
      best = guess;
    }
  }

  return best!;
}
