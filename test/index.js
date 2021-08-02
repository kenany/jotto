'use strict';

/* eslint-disable quote-props */

const test = require('tape');
const filter = require('lodash.filter');
const forEach = require('lodash.foreach');
const isPlainObject = require('lodash.isplainobject');
const isFunction = require('lodash.isfunction');
const noRepeatedLetters = require('no-repeated-letters');
const sowpodsFive = require('sowpods-five');
const sowpodsSix = require('sowpods-six');

const jotto = require('../');

test('exports an object that contains two functions', function(t) {
  t.plan(3);
  t.ok(isPlainObject(jotto));
  t.ok(isFunction(jotto.narrowDownPossibleWords));
  t.ok(isFunction(jotto.bestGuess));
});

test('calculates best guess', function(t) {
  t.plan(7);

  const TEST_GUESSES = [
    [{ 'bread': 0 }, 'tying'],
    [{ 'bread': 1 }, 'algin'],
    [{ 'bread': 2 }, 'parts'],
    [{ 'bread': 3 }, 'biros'],
    [{ 'bread': 4 }, 'boils'],
    [{ 'bread': 1, 'anvil': 2 }, 'irone'],
    [{ 'abcde': 1, 'fghij': 1, 'klmno': 1, 'pqrst': 1, 'uvwxy': 1 }, 'riley']
  ];

  const words = filter(sowpodsFive, noRepeatedLetters);
  forEach(TEST_GUESSES, function(fixture) {
    const possibleWords = jotto.narrowDownPossibleWords(words, fixture[0]);
    t.equal(jotto.bestGuess(words, possibleWords), fixture[1]);
  });
});

test('works with six-letter words', function(t) {
  t.plan(5);

  const TEST_GUESSES = [
    [{ 'charts': 0 }, 'puking'],
    [{ 'charts': 1 }, 'gamins'],
    [{ 'charts': 2 }, 'ingots'],
    [{ 'charts': 3 }, 'chiton'],
    [{ 'charts': 4 }, 'chopin']
  ];

  const words = filter(sowpodsSix, noRepeatedLetters);
  forEach(TEST_GUESSES, function(fixture) {
    const possibleWords = jotto.narrowDownPossibleWords(words, fixture[0]);
    t.equal(jotto.bestGuess(words, possibleWords), fixture[1]);
  });
});
