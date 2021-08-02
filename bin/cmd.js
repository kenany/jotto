#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('graceful-fs');
const humanize = require('humanize-number');
const filter = require('lodash.filter');
const keys = require('lodash.keys');
const minimist = require('minimist');
const noRepeatedLetters = require('no-repeated-letters');
const path = require('path');
const printf = require('printf');
const process = require('process');
const sowpodsFive = require('sowpods-five');
const sowpodsSix = require('sowpods-six');

const jotto = require('../');

const argv = minimist(process.argv.slice(2), {
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

let previousGuesses = {};

if (!process.stdin.isTTY) {
  let temp = '';

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
  let words = sowpodsFive;
  const guesses = keys(previousGuesses);
  if (guesses && guesses[0]) {
    words = guesses[0].length === 6 ? sowpodsSix : sowpodsFive;
  }

  /* eslint-disable no-console */
  console.log();
  console.log(printf('%22s : %6s words', chalk.cyan('Imported'), humanize(words.length)));

  words = filter(words, noRepeatedLetters);
  console.log(printf('%22s : %6s words', chalk.cyan('Using'), humanize(words.length)));

  const possibleWords = jotto.narrowDownPossibleWords(words, previousGuesses);
  console.log(printf('%22s : %6s words', chalk.cyan('Possible'), humanize(possibleWords.length)));

  const guess = jotto.bestGuess(words, possibleWords);
  console.log(printf('%22s : %6s', chalk.cyan('Best guess'), chalk.bold.green(guess)));

  if (possibleWords.length < 6 && possibleWords.length > 1) {
    console.log(printf('%22s : %s', chalk.cyan('Words'), possibleWords.join(', ')));
  }
  /* eslint-enable no-console */
}
