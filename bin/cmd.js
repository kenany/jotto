var chalk = require('chalk');
var fs = require('graceful-fs');
var humanize = require('humanize-number');
var jots = require('jots');
var filter = require('lodash.filter');
var forEach = require('lodash.foreach');
var forOwn = require('lodash.forown');
var noRepeatedLetters = require('no-repeated-letters');
var path = require('path');
var printf = require('printf');
var split = require('split');

var bestGuess = require('../');

var prevguesses = {};

var words = [];
fs.createReadStream(path.resolve(__dirname, '../5words.txt'))
  .pipe(split())
  .on('data', function(line) {
    words.push(line);
  })
  .on('end', function() {
    if (!process.stdin.isTTY) {
      var data = '';
      process.stdin
        .on('data', function(d) { data += d })
        .on('end', function() {
          prevguesses = JSON.parse(data);
          next()
        });
    }
    else {
      next();
    }
  });

function next() {
  console.log();
  console.log(printf('%22s : %6s words', chalk.cyan('Imported'), humanize(words.length)));

  // Remove words that have multiple occurrences of a single letter.
  words = filter(words, noRepeatedLetters);
  console.log(printf('%22s : %6s words', chalk.cyan('Using'), humanize(words.length)));

  var possibleWords = words;

  // Narrow down possible words by using the scores of previous guesses.
  forOwn(prevguesses, function(score, guess) {
    var possibilities = [];
    forEach(possibleWords, function(word) {
      if (jots(word, guess) === score) {
        possibilities.push(word);
      }
    });
    possibleWords = possibilities;
  });

  console.log(printf('%22s : %6s words', chalk.cyan('Possible'), humanize(possibleWords.length)));

  var guess = bestGuess(words, possibleWords);
  console.log(printf('%22s : %6s', chalk.cyan('Best guess'), chalk.bold.green(guess)));
}