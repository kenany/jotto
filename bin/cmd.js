var jotto = require('../');
var chalk = require('chalk');
var fs = require('graceful-fs');
var humanize = require('humanize-number');
var JSONStream = require('JSONStream');
var filter = require('lodash.filter');
var noRepeatedLetters = require('no-repeated-letters');
var path = require('path');
var printf = require('printf');
var split = require('split');

var previousGuesses = {};

var words = [];
fs.createReadStream(path.resolve(__dirname, '../5words.txt'))
  .pipe(split())
  .on('data', function(line) {
    words.push(line);
  })
  .on('end', function() {
    if (!process.stdin.isTTY) {
      process.stdin
        .pipe(JSONStream.parse())
        .on('root', function(obj) {
          previousGuesses = obj;
          next();
        });
    }
    else {
      next();
    }
  });

function next() {
  console.log();
  console.log(printf('%22s : %6s words', chalk.cyan('Imported'), humanize(words.length)));

  words = filter(words, noRepeatedLetters);
  console.log(printf('%22s : %6s words', chalk.cyan('Using'), humanize(words.length)));

  var possibleWords = jotto.narrowDownPossibleWords(words, previousGuesses);
  console.log(printf('%22s : %6s words', chalk.cyan('Possible'), humanize(possibleWords.length)));

  var guess = jotto.bestGuess(words, possibleWords);
  console.log(printf('%22s : %6s', chalk.cyan('Best guess'), chalk.bold.green(guess)));
}