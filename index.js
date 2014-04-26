var jots = require('jots');
var contains = require('lodash.contains');
var forEach = require('lodash.foreach');
var min = require('lodash.min');

/**
 * Figure out how likely each result is from this guess.
 *
 * @param {Array} possible words
 * @param {String} guess
 * @return {Array} results
 * @api private
 */
function guessResults(possibleWords, guess) {
  var results = [0, 0, 0, 0, 0, 0];
  forEach(possibleWords, function(word) {
    results[jots(word, guess)] += 1;
  });
  return results;
}

/**
 * Get the weighted average of the results. Lower is better.
 *
 * @param {Array} possible words
 * @param {String} guess
 * @return {Number} average
 * @api private
 */
function guessValue(possibleWords, guess) {
  var results = guessResults(possibleWords, guess);

  var average = 0;
  var sum = 0;
  forEach(results, function(i) {
    average += Math.pow(i, 2);
    sum += i;
  });

  return average / sum;
}

/**
 * Figure out the best possible guess.
 *
 * @param {Array} words
 * @param {Array} possible words
 * @return {String} best guess
 * @api public
 */
function bestGuess(words, possibleWords) {
  return min(words, prefer);

  /**
   * Develop preference for possible words over impossible words.
   *
   * @param {String} guess
   * @return {Number} preference
   * @api private
   */
  function prefer(guess) {
    if (!contains(possibleWords, guess)) {
      return Infinity;
    }
    return guessValue(possibleWords, guess);
  }
}

module.exports = bestGuess;