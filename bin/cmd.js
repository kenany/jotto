#!/usr/bin/env node

var jotto = require('../');
var chalk = require('chalk');
var fs = require('graceful-fs');
var humanize = require('humanize-number');
var filter = require('lodash.filter');
var keys = require('lodash.keys');
var minimist = require('minimist');
var noRepeatedLetters = require('no-repeated-letters');
var path = require('path');
var printf = require('printf');
var process = require('process');
var sowpodsFive = require('sowpods-five');
var sowpodsSix = require('sowpods-six');

var argv = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version'
  }
});

if (argv.version) {
  process.stdout.write(require('../package.json').version);
  process.stdout.write('\n');

  // eslint-disable-next-line no-process-exit
  process.exit(0);
}
else if (argv.help) {
  fs.createReadStream(path.resolve(__dirname, './usage.txt'))
    .pipe(process.stdout);

  // eslint-disable-next-line no-process-exit
  process.exit(0);
}

var previousGuesses = {};

if (!process.stdin.isTTY) {
  var temp = '';

  process.stdin.on('data', function(chunk) {
    temp += chunk;
  });

  process.stdin.on('end', function() {
    previousGuesses = JSON.parse(temp);
    next();
  });
}
else {
  next();
}

function next() {
  var words = sowpodsFive;
  var guesses = keys(previousGuesses);
  if (guesses && guesses[0]) {
    words = guesses[0].length === 6 ? sowpodsSix : sowpodsFive;
  }

  console.log();
  console.log(printf('%22s : %6s words', chalk.cyan('Imported'), humanize(words.length)));

  words = filter(words, noRepeatedLetters);
  console.log(printf('%22s : %6s words', chalk.cyan('Using'), humanize(words.length)));

  var possibleWords = jotto.narrowDownPossibleWords(words, previousGuesses);
  console.log(printf('%22s : %6s words', chalk.cyan('Possible'), humanize(possibleWords.length)));

  var guess = jotto.bestGuess(words, possibleWords);
  console.log(printf('%22s : %6s', chalk.cyan('Best guess'), chalk.bold.green(guess)));

  if (possibleWords.length < 6 && possibleWords.length > 1) {
    console.log(printf('%22s : %s', chalk.cyan('Words'), possibleWords.join(', ')));
  }
}
