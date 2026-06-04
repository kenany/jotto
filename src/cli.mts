#!/usr/bin/env node

import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import chalk from 'chalk';
import fs from 'graceful-fs';
import humanize from 'humanize-number';
import minimist from 'minimist';
import { noRepeatedLetters } from 'no-repeated-letters';
import printf from 'printf';
import sowpodsFive from 'sowpods-five';
import sowpodsSix from 'sowpods-six';

import { bestGuess, narrowDownPossibleWords } from './index.js';

const argv = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
  },
});

if (argv.version) {
  const require = createRequire(import.meta.url);
  const { version } = require('../package.json') as { version: string };
  process.stdout.write(`${version}\n`);
  process.exit(0);
} else if (argv.help) {
  fs.createReadStream(path.resolve(import.meta.dirname, '../usage.txt')).pipe(
    process.stdout
  );
  process.exit(0);
}

let previousGuesses: Record<string, number> = {};

if (process.stdin.isTTY) {
  next();
} else {
  let temp = '';

  process.stdin.on('data', (chunk) => {
    temp += chunk;
  });

  process.stdin.on('end', () => {
    previousGuesses = JSON.parse(temp);
    next();
  });
}

function next() {
  let words: readonly string[] = sowpodsFive;
  const guesses = Object.keys(previousGuesses);
  if (guesses[0]) {
    words = guesses[0].length === 6 ? sowpodsSix : sowpodsFive;
  }

  process.stdout.write('\n');
  process.stdout.write(
    `${printf('%22s : %6s words', chalk.cyan('Imported'), humanize(words.length))}\n`
  );

  words = (words as string[]).filter(noRepeatedLetters);
  process.stdout.write(
    `${printf('%22s : %6s words', chalk.cyan('Using'), humanize(words.length))}\n`
  );

  const possibleWords = narrowDownPossibleWords(words, previousGuesses);
  process.stdout.write(
    `${printf('%22s : %6s words', chalk.cyan('Possible'), humanize(possibleWords.length))}\n`
  );

  const guess = bestGuess(words, possibleWords);
  process.stdout.write(
    `${printf('%22s : %6s', chalk.cyan('Best guess'), chalk.bold.green(guess))}\n`
  );

  if (possibleWords.length < 6 && possibleWords.length > 1) {
    process.stdout.write(
      `${printf('%22s : %s', chalk.cyan('Words'), possibleWords.join(', '))}\n`
    );
  }
}
