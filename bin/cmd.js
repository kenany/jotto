var jotto = require('../');
var chalk = require('chalk');
var fs = require('graceful-fs');
var humanize = require('humanize-number');
var JSONStream = require('JSONStream');
var filter = require('lodash.filter');
var keys = require('lodash.keys');
var minimist = require('minimist');
var noRepeatedLetters = require('no-repeated-letters');
var printf = require('printf');
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
  return;
}
else if (argv.help) {
  fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
  return;
}

var previousGuesses = {};

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

function next() {
  var words = sowpodsSix;
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