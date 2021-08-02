const jots = require('jots');
const forEach = require('lodash.foreach');
const forOwn = require('lodash.forown');
const minBy = require('lodash.minby');

/**
 * Figure out how likely each result is from this guess.
 *
 * @param {readonly string[]} possibleWords
 * @param {string} guess
 * @return {number[]} results
 * @api private
 */
function guessResults(possibleWords, guess) {
  const results = [0, 0, 0, 0, 0, 0, 0];
  forEach(possibleWords, function(word) {
    results[jots(word, guess)] += 1;
  });
  return results;
}

/**
 * Get the weighted average of the results. Lower is better.
 *
 * @param {readonly string[]} possibleWords
 * @param {string} guess
 * @return {number} average
 * @api private
 */
function guessValue(possibleWords, guess) {
  const results = guessResults(possibleWords, guess);

  let average = 0;
  let sum = 0;
  forEach(results, function(i) {
    average += Math.pow(i, 2);
    sum += i;
  });

  return average / sum;
}

/**
 * Narrows down possible solutions based on previous guesses.
 *
 * @param {string[]} words
 * @param {readonly string[]} previousGuesses
 * @return {string[]} possible words
 * @api public
 */
function narrowDownPossibleWords(words, previousGuesses) {
  forOwn(previousGuesses, function(score, guess) {
    const possibilities = [];
    forEach(words, function(word) {
      if (jots(word, guess) === score) {
        possibilities.push(word);
      }
    });
    words = possibilities;
  });

  return words;
}

/**
 * Figure out the best possible guess.
 *
 * @param {readonly string[]} words
 * @param {readonly string[]} possibleWords
 * @return {string} best guess
 * @api public
 */
function bestGuess(words, possibleWords) {
  return minBy(words, prefer);

  /**
   * Develop preference for possible words over impossible words.
   *
   * @param {string} guess
   * @return {number} preference
   * @api private
   */
  function prefer(guess) {
    return guessValue(possibleWords, guess);
  }
}

module.exports = {
  bestGuess,
  narrowDownPossibleWords
};
