var jotto = require('../');
var test = require('tape');
var filter = require('lodash.filter');
var forEach = require('lodash.foreach');
var isPlainObject = require('lodash.isplainobject');
var isFunction = require('lodash.isfunction');
var noRepeatedLetters = require('no-repeated-letters');
var words = require('sowpods-five');

test('exports an object that contains two functions', function(t) {
  t.plan(3);
  t.ok(isPlainObject(jotto));
  t.ok(isFunction(jotto.narrowDownPossibleWords));
  t.ok(isFunction(jotto.bestGuess));
});

test('calculates best guess', function(t) {
  t.plan(7);

  var TEST_GUESSES = [
    [{'bread': 0}, 'tying'],
    [{'bread': 1}, 'algin'],
    [{'bread': 2}, 'parts'],
    [{'bread': 3}, 'biros'],
    [{'bread': 4}, 'boils'],
    [{'bread': 1, 'anvil': 2}, 'irone'],
    [{'abcde': 1, 'fghij': 1, 'klmno': 1, 'pqrst': 1, 'uvwxy': 1}, 'riley']
  ];

  words = filter(words, noRepeatedLetters);
  forEach(TEST_GUESSES, function(fixture) {
    var possibleWords = jotto.narrowDownPossibleWords(words, fixture[0]);
    t.equal(jotto.bestGuess(words, possibleWords), fixture[1]);
  });
});