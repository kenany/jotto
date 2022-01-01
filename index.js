'use strict';

const jots = require('jots');
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
  for (const word of possibleWords) {
    results[jots(word, guess)] += 1;
  }
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
  for (const i of results) {
    average += Math.pow(i, 2);
    sum += i;
  }

  return average / sum;
}

/**
 * Narrows down possible solutions based on previous guesses.
 *
 * @param {readonly string[]} words Valid words.
 * @param {{ [guess: string]: number; }} previousGuesses Previous guesses and
 *  their scores.
 * @return {string[]} Possible words.
 * @api public
 */
function narrowDownPossibleWords(words, previousGuesses) {
  return words
    .filter(
      (word) => Object.entries(previousGuesses).every(
        ([guess, score]) => jots(word, guess) === score
      )
    );
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
  return minBy(words, (guess) => guessValue(possibleWords, guess));
}

module.exports = {
  bestGuess,
  narrowDownPossibleWords
};
